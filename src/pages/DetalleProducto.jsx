import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import Alert from 'react-bootstrap/Alert'
import Badge from 'react-bootstrap/Badge'
import Button from 'react-bootstrap/Button'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import Spinner from 'react-bootstrap/Spinner'

import { formatearPrecio } from '../datos/productos.js'
import { mensajeDeError } from '../servicios/errores.js'
import { obtenerProducto } from '../servicios/productos.js'

export default function DetalleProducto({ onAgregar }) {
  const { id } = useParams()
  const navegar = useNavigate()

  const [producto, setProducto] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)
  const [noExiste, setNoExiste] = useState(false)

  useEffect(() => {
    let ignorar = false

    async function cargar() {
      setCargando(true)
      setError(null)
      setNoExiste(false)
      try {
        // Ya no hace falta Number(id): el id viaja en la URL y lo
        // convierte Spring Boot con @PathVariable Long id.
        const datos = await obtenerProducto(id)
        if (!ignorar) setProducto(datos)
      } catch (e) {
        if (ignorar) return
        // 404: no existe · 400: el id no es un número (/producto/abc).
        // Cualquier otro error es un problema de conexión o del servidor.
        const estado = e.response?.status
        if (estado === 404 || estado === 400) {
          setNoExiste(true)
        } else {
          setError(mensajeDeError(e))
        }
      } finally {
        if (!ignorar) setCargando(false)
      }
    }

    cargar()
    return () => {
      ignorar = true
    }
  }, [id])

  if (cargando) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" role="status" />
        <p className="text-muted mt-2">Cargando producto…</p>
      </div>
    )
  }

  if (noExiste) {
    return (
      <Alert variant="danger">
        <Alert.Heading>No encontramos ese producto</Alert.Heading>
        <p>
          El identificador <code>{id}</code> no corresponde a ningún artículo del catálogo.
        </p>
        <Button as={Link} to="/catalogo" variant="outline-danger">
          Volver al catálogo
        </Button>
      </Alert>
    )
  }

  if (error) {
    return (
      <Alert variant="danger">
        <Alert.Heading>No pudimos cargar el producto</Alert.Heading>
        <p className="mb-0">{error}</p>
      </Alert>
    )
  }

  return (
    <Row className="g-4">
      <Col xs={12} md={5} className="text-center display-1" aria-hidden="true">
        {producto.emoji}
      </Col>

      <Col xs={12} md={7}>
        <Badge bg="secondary" className="text-capitalize mb-2">
          {producto.categoria}
        </Badge>
        <h1 className="h3">{producto.nombre}</h1>
        <p className="fs-4 fw-semibold">{formatearPrecio(producto.precio)}</p>
        <p>{producto.descripcion}</p>
        <p className="text-muted">
          {producto.stock > 0 ? `Quedan ${producto.stock} unidades.` : 'Producto agotado por ahora.'}
        </p>

        <div className="d-flex flex-column flex-sm-row gap-2">
          <Button
            disabled={producto.stock === 0}
            onClick={() => {
              onAgregar(producto)
              navegar('/carrito')
            }}
          >
            Agregar y ver carrito
          </Button>
          <Button variant="outline-secondary" onClick={() => navegar(-1)}>
            Volver
          </Button>
        </div>
      </Col>
    </Row>
  )
}