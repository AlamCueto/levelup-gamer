import api from './api.js'

// Capa de servicios: el único archivo que sabe que los productos viven en
// /productos. Las páginas llaman a estas funciones y no escriben URLs.
//
// axios entrega la respuesta completa (status, headers, data…). Cada función
// devuelve solo respuesta.data, que es el JSON ya convertido en objeto.

// GET /productos  ·  GET /productos?categoria=audio
export async function listarProductos(categoria) {
  // axios arma el "?categoria=audio" a partir de params. Si categoria es
  // undefined, simplemente no lo agrega.
  const respuesta = await api.get('/productos', {
    params: { categoria: categoria || undefined },
  })
  return respuesta.data
}

// GET /productos/3
export async function obtenerProducto(id) {
  const respuesta = await api.get(`/productos/${id}`)
  return respuesta.data
}

// POST /productos — axios convierte el objeto a JSON y agrega el encabezado
// Content-Type: application/json. La API responde 201 con el producto creado.
export async function crearProducto(producto) {
  const respuesta = await api.post('/productos', producto)
  return respuesta.data
}

// PUT /productos/3 — reemplaza los datos del producto 3.
export async function actualizarProducto(id, producto) {
  const respuesta = await api.put(`/productos/${id}`, producto)
  return respuesta.data
}

// DELETE /productos/3 — la API responde 204 (sin cuerpo): no hay data que devolver.
export async function eliminarProducto(id) {
  await api.delete(`/productos/${id}`)
}