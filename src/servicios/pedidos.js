import api from './api.js';

// GET /api/v1/pedidos — Lista todas las órdenes/boletas (ADMIN y VENDEDOR)
export async function listarPedidos() {
  const respuesta = await api.get('/pedidos');
  return respuesta.data;
}

// GET /api/v1/pedidos/{id} — Obtiene el detalle de una orden específica
export async function obtenerPedido(id) {
  const respuesta = await api.get(`/pedidos/${id}`);
  return respuesta.data;
}

// POST /api/v1/pedidos — Crea una nueva compra y descuenta stock en MySQL
export async function enviarPedido(carrito) {
  const solicitud = {
    lineas: carrito.map((linea) => ({ productoId: linea.id, cantidad: linea.cantidad })),
  };
  const respuesta = await api.post('/pedidos', solicitud);
  return respuesta.data;
}