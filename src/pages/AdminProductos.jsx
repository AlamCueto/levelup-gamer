import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router'
import Alert from 'react-bootstrap/Alert'
import Button from 'react-bootstrap/Button'
import Spinner from 'react-bootstrap/Spinner'
import Table from 'react-bootstrap/Table'

import { formatearPrecio } from '../datos/productos.js'
import { mensajeDeError } from '../servicios/errores.js'
import { eliminarProducto, listarProductos } from '../servicios/productos.js'

// Panel de administración: la "R" y la "D" del CRUD. La "C" y la "U" están
// en FormularioProducto.
export default function AdminProductos() {
  // Si venimos del formulario, trae un aviso en el state de la navegación.
  const ubicacion = useLocation()
  const [aviso, setAviso] = useState(ubicacion.state?.aviso ?? null)

  const [productos, setProductos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let ignorar = false

    async function cargar() {
      try {
        const datos = await listarProductos()
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
  }, [])

  async function eliminar(producto) {
    if (!window.confirm(`¿Eliminar «${producto.nombre}»? No se puede deshacer.`)) return

    try {
      await eliminarProducto(producto.id)
      // La API respondió 204: lo quitamos de la tabla sin volver a pedir la lista.
      setProductos((actual) => actual.filter((p) => p.id !== producto.id))
      setAviso(`Se eliminó «${producto.nombre}».`)
    } catch (e) {
      setError(mensajeDeError(e))
    }
  }

  return (
    <>
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-2 mb-3">
        <h1 className="h3 mb-0">Administrar productos</h1>
        <Button as={Link} to="/admin/nuevo">
          + Nuevo producto
        </Button>
      </div>

      {aviso && (
        <Alert variant="success" dismissible onClose={() => setAviso(null)}>
          {aviso}
        </Alert>
      )}
      {error && (
        <Alert variant="danger" dismissible onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {cargando ? (
        <div className="text-center py-5">
          <Spinner animation="border" role="status" />
        </div>
      ) : (
        <Table responsive striped hover className="align-middle">
          <thead>
            <tr>
              <th>Producto</th>
              <th>Categoría</th>
              <th className="text-end">Precio</th>
              <th className="text-end">Stock</th>
              <th className="text-end">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productos.map((producto) => (
              <tr key={producto.id}>
                <td>
                  <span aria-hidden="true">{producto.emoji}</span> {producto.nombre}
                </td>
                <td className="text-capitalize">{producto.categoria}</td>
                <td className="text-end">{formatearPrecio(producto.precio)}</td>
                <td className="text-end">{producto.stock}</td>
                <td className="text-end text-nowrap">
                  <Button
                    as={Link}
                    to={`/admin/editar/${producto.id}`}
                    size="sm"
                    variant="outline-primary"
                    className="me-2"
                  >
                    Editar
                  </Button>
                  <Button size="sm" variant="outline-danger" onClick={() => eliminar(producto)}>
                    Eliminar
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </>
  )
}