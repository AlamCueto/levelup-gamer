import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router'
import Alert from 'react-bootstrap/Alert'
import Button from 'react-bootstrap/Button'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row'
import Spinner from 'react-bootstrap/Spinner'

import TarjetaProducto from '../componentes/TarjetaProducto.jsx'
import { categorias } from '../datos/productos.js'
import { mensajeDeError } from '../servicios/errores.js'
import { listarProductos } from '../servicios/productos.js'

export default function Catalogo({ onAgregar }) {
  const [parametros, setParametros] = useSearchParams()
  const textoBuscado = parametros.get('buscar') ?? ''
  const categoriaElegida = parametros.get('categoria') ?? ''

  // Toda página que pide datos a una API tiene estos tres estados.
  const [productos, setProductos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)
  const [intento, setIntento] = useState(0) // sube en 1 para "Reintentar"

  // Pedir datos a un servidor es hablarle a algo que no es React: va en un
  // efecto. Se repite cada vez que cambia la categoría o se pulsa Reintentar.
  useEffect(() => {
    // Si el usuario cambia de categoría antes de que llegue la respuesta
    // anterior, "ignorar" evita que esa respuesta vieja pise a la nueva.
    let ignorar = false

    async function cargar() {
      setCargando(true)
      setError(null)
      try {
        const datos = await listarProductos(categoriaElegida)
        if (!ignorar) setProductos(datos)
      } catch (e) {
        if (!ignorar) setError(mensajeDeError(e))
      } finally {
        if (!ignorar) setCargando(false)
      }
    }

    cargar()
    return () => {
      ignorar = true
    }
  }, [categoriaElegida, intento])

  function actualizarParametro(clave, valor) {
    const copia = new URLSearchParams(parametros)
    if (valor) {
      copia.set(clave, valor)
    } else {
      copia.delete(clave)
    }
    setParametros(copia)
  }

  // La categoría la filtra el servidor; el texto lo filtramos aquí.
  const visibles = productos.filter((producto) =>
    producto.nombre.toLowerCase().includes(textoBuscado.toLowerCase()),
  )

  return (
    <>
      <h1 className="h3 mb-3">Catálogo</h1>

      <Row className="g-2 mb-4">
        <Col xs={12} md={8}>
          <Form.Label htmlFor="buscar" visuallyHidden>
            Buscar producto
          </Form.Label>
          <Form.Control
            id="buscar"
            type="search"
            placeholder="Buscar producto…"
            value={textoBuscado}
            onChange={(evento) => actualizarParametro('buscar', evento.target.value)}
          />
        </Col>
        <Col xs={12} md={4}>
          <Form.Label htmlFor="categoria" visuallyHidden>
            Filtrar por categoría
          </Form.Label>
          <Form.Select
            id="categoria"
            value={categoriaElegida}
            onChange={(evento) => actualizarParametro('categoria', evento.target.value)}
          >
            <option value="">Todas las categorías</option>
            {categorias.map((categoria) => (
              <option key={categoria} value={categoria}>
                {categoria}
              </option>
            ))}
          </Form.Select>
        </Col>
      </Row>

      {cargando ? (
        <div className="text-center py-5">
          <Spinner animation="border" role="status" />
          <p className="text-muted mt-2">Cargando productos…</p>
        </div>
      ) : error ? (
        <Alert variant="danger">
          <Alert.Heading>No pudimos cargar el catálogo</Alert.Heading>
          <p>{error}</p>
          <Button variant="outline-danger" onClick={() => setIntento((n) => n + 1)}>
            Reintentar
          </Button>
        </Alert>
      ) : visibles.length === 0 ? (
        <Alert variant="warning">No hay productos que coincidan con la búsqueda.</Alert>
      ) : (
        <Row xs={1} sm={2} lg={3} className="g-3">
          {visibles.map((producto) => (
            <Col key={producto.id}>
              <TarjetaProducto producto={producto} onAgregar={onAgregar} />
            </Col>
          ))}
        </Row>
      )}
    </>
  )
}