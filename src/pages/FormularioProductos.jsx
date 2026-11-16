import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import Alert from 'react-bootstrap/Alert'
import Button from 'react-bootstrap/Button'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row'
import Spinner from 'react-bootstrap/Spinner'

import { categorias } from '../datos/productos.js'
import { mensajeDeError } from '../servicios/errores.js'
import { actualizarProducto, crearProducto, obtenerProducto } from '../servicios/productos.js'

const FORMULARIO_VACIO = {
  nombre: '',
  categoria: 'computacion',
  precio: '',
  stock: '',
  descripcion: '',
  emoji: '📦',
}

// Un solo formulario para crear (/admin/nuevo) y editar (/admin/editar/:id).
// Si la URL trae id, estamos editando.
export default function FormularioProducto() {
  const { id } = useParams()
  const esEdicion = id !== undefined
  const navegar = useNavigate()

  const [datos, setDatos] = useState(FORMULARIO_VACIO)
  const [cargando, setCargando] = useState(esEdicion)
  const [guardando, setGuardando] = useState(false)
  const [error, setError] = useState(null)
  const [erroresCampos, setErroresCampos] = useState({}) // { precio: 'El precio debe…' }

  // Al editar, primero traemos el producto y llenamos el formulario.
  useEffect(() => {
    if (!esEdicion) return
    let ignorar = false

    async function cargar() {
      try {
        const producto = await obtenerProducto(id)
        // Los inputs trabajan con texto: convertimos los números a String.
        if (!ignorar) {
          setDatos({
            nombre: producto.nombre,
            categoria: producto.categoria,
            precio: String(producto.precio),
            stock: String(producto.stock),
            descripcion: producto.descripcion ?? '',
            emoji: producto.emoji ?? '',
          })
        }
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
  }, [id, esEdicion])

  function alEscribir(evento) {
    const { name, value } = evento.target
    setDatos((actual) => ({ ...actual, [name]: value }))
  }

  async function alGuardar(evento) {
    evento.preventDefault()
    setGuardando(true)
    setError(null)
    setErroresCampos({})

    // Lo que viaja a la API: números como números. Un campo vacío se manda
    // como null para que Spring responda "El precio es obligatorio".
    const producto = {
      ...datos,
      precio: datos.precio === '' ? null : Number(datos.precio),
      stock: datos.stock === '' ? null : Number(datos.stock),
    }

    try {
      const guardado = esEdicion
        ? await actualizarProducto(id, producto)
        : await crearProducto(producto)
      navegar('/admin', { state: { aviso: `Se guardó «${guardado.nombre}».` } })
    } catch (e) {
      setError(mensajeDeError(e))
      // 400: la API devuelve un mensaje por campo en data.campos.
      if (e.response?.status === 400) {
        setErroresCampos(e.response.data?.campos ?? {})
      }
    } finally {
      setGuardando(false)
    }
  }

  if (cargando) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" role="status" />
      </div>
    )
  }

  return (
    <>
      <h1 className="h3 mb-3">{esEdicion ? 'Editar producto' : 'Nuevo producto'}</h1>

      {error && <Alert variant="danger">{error}</Alert>}

      {/* noValidate: dejamos que valide el servidor para ver el error 400. */}
      <Form noValidate onSubmit={alGuardar} style={{ maxWidth: 720 }}>
        <Row className="g-3">
          <Col xs={12} md={9}>
            <Form.Group controlId="nombre">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                name="nombre"
                value={datos.nombre}
                onChange={alEscribir}
                isInvalid={!!erroresCampos.nombre}
              />
              <Form.Control.Feedback type="invalid">{erroresCampos.nombre}</Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col xs={12} md={3}>
            <Form.Group controlId="emoji">
              <Form.Label>Emoji</Form.Label>
              <Form.Control name="emoji" value={datos.emoji} onChange={alEscribir} />
            </Form.Group>
          </Col>

          <Col xs={12} md={4}>
            <Form.Group controlId="categoria">
              <Form.Label>Categoría</Form.Label>
              <Form.Select
                name="categoria"
                value={datos.categoria}
                onChange={alEscribir}
                isInvalid={!!erroresCampos.categoria}
              >
                {categorias.map((categoria) => (
                  <option key={categoria} value={categoria}>
                    {categoria}
                  </option>
                ))}
              </Form.Select>
              <Form.Control.Feedback type="invalid">{erroresCampos.categoria}</Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col xs={6} md={4}>
            <Form.Group controlId="precio">
              <Form.Label>Precio (CLP)</Form.Label>
              <Form.Control
                type="number"
                name="precio"
                value={datos.precio}
                onChange={alEscribir}
                isInvalid={!!erroresCampos.precio}
              />
              <Form.Control.Feedback type="invalid">{erroresCampos.precio}</Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col xs={6} md={4}>
            <Form.Group controlId="stock">
              <Form.Label>Stock</Form.Label>
              <Form.Control
                type="number"
                name="stock"
                value={datos.stock}
                onChange={alEscribir}
                isInvalid={!!erroresCampos.stock}
              />
              <Form.Control.Feedback type="invalid">{erroresCampos.stock}</Form.Control.Feedback>
            </Form.Group>
          </Col>

          <Col xs={12}>
            <Form.Group controlId="descripcion">
              <Form.Label>Descripción</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="descripcion"
                value={datos.descripcion}
                onChange={alEscribir}
                isInvalid={!!erroresCampos.descripcion}
              />
              <Form.Control.Feedback type="invalid">{erroresCampos.descripcion}</Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>

        <div className="d-flex gap-2 mt-4">
          <Button type="submit" disabled={guardando}>
            {guardando ? 'Guardando…' : esEdicion ? 'Guardar cambios' : 'Crear producto'}
          </Button>
          <Button as={Link} to="/admin" variant="outline-secondary">
            Cancelar
          </Button>
        </div>
      </Form>
    </>
  )
}