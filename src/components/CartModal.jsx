import React from 'react';
import { Modal, Button, Table } from 'react-bootstrap';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

export const CartModal = ({ show, handleClose }) => {
  const { cart, removeFromCart, clearCart, subtotal, descuentoDuoc, total } = useCart();
  const navigate = useNavigate();

  const handleIrAlCheckout = () => {
    handleClose(); // Cierra el modal flotante
    navigate('/checkout'); // Redirige a la vista de Checkout
  };

  return (
    <Modal show={show} onHide={handleClose} centered size="lg">
      <Modal.Header closeButton className="bg-dark text-white border-secondary">
        <Modal.Title className="neon-green fw-bold">Tu Carrito Gamer 🛒</Modal.Title>
      </Modal.Header>
      
      <Modal.Body className="bg-dark text-white">
        {cart.length === 0 ? (
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
                    <td>${item.precio.toLocaleString('es-CL')}</td>
                    <td>{item.cantidad}</td>
                    <td className="text-success fw-bold">${(item.precio * item.cantidad).toLocaleString('es-CL')}</td>
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
                Subtotal: <strong>${subtotal.toLocaleString('es-CL')} CLP</strong>
              </p>
              
              {descuentoDuoc > 0 && (
                <p className="mb-1 text-success fw-bold">
                  Descuento Duoc (20%): <strong>-${descuentoDuoc.toLocaleString('es-CL')} CLP</strong>
                </p>
              )}

              <h4 className="text-neon-green fw-bold mt-2">
                Total: ${total.toLocaleString('es-CL')} CLP
              </h4>
            </div>
          </>
        )}
      </Modal.Body>

      <Modal.Footer className="bg-dark border-secondary">
        <Button variant="secondary" onClick={handleClose}>
          Seguir Comprando
        </Button>
        {cart.length > 0 && (
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