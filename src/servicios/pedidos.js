import api from './api.js'

// POST /pedidos — envía solo qué producto y cuántas unidades.
// El precio no viaja: el servidor lo busca en su base de datos y calcula el
// total. Nunca se confía en un precio que viene del navegador.
export async function enviarPedido(carrito) {
  const solicitud = {
    lineas: carrito.map((linea) => ({ productoId: linea.id, cantidad: linea.cantidad })),
  }
  const respuesta = await api.post('/pedidos', solicitud)
  return respuesta.data // { id, fecha, unidades, total }
}