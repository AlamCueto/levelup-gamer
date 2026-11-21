import React from 'react';
import { Modal, Button, Table, Alert } from 'react-bootstrap';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export const CartModal = ({ show, onHide, handleClose }) => {
  const { cart, removeFromCart, clearCart, subtotal, descuentoDuoc, total } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const cerrarModal = onHide || handleClose || (() => {});
  const rol = user?.rol || user?.role || null;
  const esVendedor = rol === 'ROLE_VENDEDOR';

  const handleIrAlCheckout = () => {
    cerrarModal();
    navigate('/checkout');
  };

  return (
    <Modal show={show} onHide={cerrarModal} centered size="lg">
      <Modal.Header closeButton className="bg-dark text-white border-secondary">
        <Modal.Title className="neon-green fw-bold">Tu Carrito Gamer 🛒</Modal.Title>
      </Modal.Header>

      <Modal.Body className="bg-dark text-white">
        {esVendedor ? (
          <Alert variant="info" className="mb-0">
            El rol <strong>VENDEDOR</strong> solo tiene acceso a visualizar productos y órdenes/boletas.
          </Alert>
        ) : cart.length === 0 ? (
          <p className="text-center text-light my-4">El carrito está vacío.</p>
        ) : (
          <>
            <Table responsive variant="dark" striped hover className="align-middle">
              <thead>
                <tr className="border-secondary text-light small">
                  <th>Producto</th>
                  <th>Precio Unit.</th>
                  <th>Cant.</th>
                  <th>Subtotal</th>
                  <th>Acción</th>
                </tr>
              </thead>
              <tbody>
                {cart.map((item) => (
                  <tr key={item.id}>
                    <td className="fw-bold">{item.nombre}</td>
                    <td>${Number(item.precio || 0).toLocaleString('es-CL')}</td>
                    <td>{item.cantidad}</td>
                    <td className="text-success fw-bold">
                      ${Number((item.precio || 0) * (item.cantidad || 1)).toLocaleString('es-CL')}
                    </td>
                    <td>
                      <Button variant="outline-danger" size="sm" onClick={() => removeFromCart(item.id)}>
                        🗑️ Eliminar
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>

            <div className="text-end border-top border-secondary pt-3">
              <p className="mb-1 text-light">
                Subtotal: <strong>${Number(subtotal || 0).toLocaleString('es-CL')} CLP</strong>
              </p>

              {descuentoDuoc > 0 && (
                <p className="mb-1 text-success fw-bold">
                  Descuento Duoc (20%): <strong>-${Number(descuentoDuoc).toLocaleString('es-CL')} CLP</strong>
                </p>
              )}

              <h4 className="text-neon-green fw-bold mt-2">
                Total: ${Number(total || 0).toLocaleString('es-CL')} CLP
              </h4>
            </div>
          </>
        )}
      </Modal.Body>

      <Modal.Footer className="bg-dark border-secondary">
        <Button variant="secondary" onClick={cerrarModal}>
          {esVendedor ? 'Cerrar' : 'Seguir Comprando'}
        </Button>
        {!esVendedor && cart.length > 0 && (
          <>
            <Button variant="outline-danger" onClick={clearCart}>
              Vaciar Carrito
            </Button>
            <Button variant="success" className="btn-neon-green fw-bold" onClick={handleIrAlCheckout}>
              Proceder al Pago →
            </Button>
          </>
        )}
      </Modal.Footer>
    </Modal>
  );
};