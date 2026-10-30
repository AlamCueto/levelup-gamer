import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Table } from 'react-bootstrap';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export const Checkout = () => {
  const { cart, total, subtotal, descuentoDuoc, esAlumnoDuocValido, clearCart, obtenerNuevoNumeroOrden } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [datosEnvio, setDatosEnvio] = useState({
    nombre: user ? user.nombre || '' : '',
    apellidos: '',
    email: user ? user.email || '' : '',
    calle: '',
    depto: '',
    region: 'Región Metropolitana de Santiago',
    comuna: 'Santiago',
    indicaciones: '',
    forzarError: false
  });

  const [estadoCompra, setEstadoCompra] = useState('checkout'); // 'checkout' | 'exito' | 'error'
  const [resumenCompra, setResumenCompra] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setDatosEnvio({
      ...datosEnvio,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleProcesarPago = (e) => {
    e.preventDefault();

    // SIMULACIÓN DE ERROR
    if (datosEnvio.forzarError || datosEnvio.calle.toLowerCase().includes('error')) {
      setEstadoCompra('error');
      return;
    }

    // GENERAR NÚMERO DE ORDEN INCREMENTAL (#123456)
    const nroOrden = obtenerNuevoNumeroOrden();

    setResumenCompra({
      nroOrden,
      codigoOrden: `ORDER-${Math.floor(10000 + Math.random() * 90000)}`,
      items: [...cart],
      subtotal,
      descuentoDuoc,
      total,
      datosEnvio: { ...datosEnvio }
    });

    clearCart();
    setEstadoCompra('exito');
  };

  // ==========================================
  // VISTA 1: BOLETA DE VENTA EXITOSA (FORMAL)
  // ==========================================
  if (estadoCompra === 'exito') {
    return (
      <Container className="my-5" style={{ maxWidth: '850px' }}>
        <Card bg="light" text="dark" className="shadow-lg border-0 rounded-3 p-4">
          <Card.Body>
            {/* Encabezado Principal */}
            <div className="d-flex justify-content-between align-items-start mb-2">
              <div>
                <h3 className="fw-bold mb-1 text-dark d-flex align-items-center gap-2">
                  <span className="text-success fs-4">☑</span> 
                  Se ha realizado la compra. nro {resumenCompra?.nroOrden}
                </h3>
                <p className="text-muted small mb-0">Completa la siguiente información</p>
              </div>
              <span className="text-muted small">
                Código orden: <strong>{resumenCompra?.codigoOrden}</strong>
              </span>
            </div>

            {/* Datos Personales */}
            <Row className="g-3 my-2">
              <Col md={4}>
                <Form.Label className="small text-muted mb-1">Nombre*</Form.Label>
                <Form.Control type="text" value={resumenCompra?.datosEnvio.nombre} readOnly bg="light" />
              </Col>
              <Col md={4}>
                <Form.Label className="small text-muted mb-1">Apellidos*</Form.Label>
                <Form.Control type="text" value={resumenCompra?.datosEnvio.apellidos || 'Gamer'} readOnly bg="light" />
              </Col>
              <Col md={4}>
                <Form.Label className="small text-muted mb-1">Correo*</Form.Label>
                <Form.Control type="text" value={resumenCompra?.datosEnvio.email} readOnly bg="light" />
              </Col>
            </Row>

            {/* Dirección de Entrega */}
            <h6 className="fw-bold text-dark mt-4 mb-2">Dirección de entrega de los productos</h6>
            <Row className="g-3 mb-2">
              <Col md={8}>
                <Form.Label className="small text-muted mb-1">Calle*</Form.Label>
                <Form.Control type="text" value={resumenCompra?.datosEnvio.calle} readOnly bg="light" />
              </Col>
              <Col md={4}>
                <Form.Label className="small text-muted mb-1">Departamento (opcional)</Form.Label>
                <Form.Control type="text" value={resumenCompra?.datosEnvio.depto || '-'} readOnly bg="light" />
              </Col>
              <Col md={6}>
                <Form.Label className="small text-muted mb-1">Región*</Form.Label>
                <Form.Control type="text" value={resumenCompra?.datosEnvio.region} readOnly bg="light" />
              </Col>
              <Col md={6}>
                <Form.Label className="small text-muted mb-1">Comuna*</Form.Label>
                <Form.Control type="text" value={resumenCompra?.datosEnvio.comuna} readOnly bg="light" />
              </Col>
              <Col md={12}>
                <Form.Label className="small text-muted mb-1">Indicaciones para la entrega (opcional)</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={2}
                  value={resumenCompra?.datosEnvio.indicaciones || 'Sin indicaciones especiales.'}
                  readOnly
                  bg="light"
                />
              </Col>
            </Row>

            {/* Tabla de Productos */}
            <Table responsive hover className="align-middle mt-4 mb-3 border-top border-bottom">
              <thead>
                <tr className="text-muted small">
                  <th>Imagen</th>
                  <th>Nombre</th>
                  <th className="text-center">Precio</th>
                  <th className="text-center">Cantidad</th>
                  <th className="text-end">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {resumenCompra?.items.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <img
                        src={item.imagen}
                        alt={item.nombre}
                        style={{ width: '45px', height: '45px', objectFit: 'cover', borderRadius: '4px' }}
                      />
                    </td>
                    <td className="fw-semibold text-dark">{item.nombre}</td>
                    <td className="text-center">${item.precio.toLocaleString('es-CL')}</td>
                    <td className="text-center">{item.cantidad}</td>
                    <td className="text-end font-monospace fw-bold">${(item.precio * item.cantidad).toLocaleString('es-CL')}</td>
                  </tr>
                ))}
              </tbody>
            </Table>

            {/* Total Pagado Banner */}
            <Card className="bg-white border text-center p-3 my-3 shadow-sm">
              <h3 className="fw-bold text-dark mb-0">
                Total pagado: ${resumenCompra?.total.toLocaleString('es-CL')}
              </h3>
              {resumenCompra?.descuentoDuoc > 0 && (
                <small className="text-success fw-bold mt-1">
                  (Incluye 20% OFF Beneficio Alumno Duoc UC: -${resumenCompra?.descuentoDuoc.toLocaleString('es-CL')})
                </small>
              )}
            </Card>

            {/* Botones de Acción Estilo Boleta */}
            <div className="d-flex justify-content-center gap-2 mt-4">
              <Button variant="danger" size="sm" className="px-3" onClick={() => window.print()}>
                Imprimir boleta en PDF
              </Button>
              <Button variant="success" size="sm" className="px-3" onClick={() => alert('Boleta enviada al correo registrado.')}>
                Enviar boleta por email
              </Button>
              <Button variant="outline-dark" size="sm" className="px-3" onClick={() => navigate('/')}>
                Volver a la Tienda
              </Button>
            </div>
          </Card.Body>
        </Card>
      </Container>
    );
  }

  // ==========================================
  // VISTA 2: COMPRA FALLIDA / RECHAZADA
  // ==========================================
  if (estadoCompra === 'error') {
    return (
      <Container className="my-5" style={{ maxWidth: '600px' }}>
        <Card bg="dark" text="white" className="border-danger shadow-lg p-4 text-center">
          <div className="fs-1 text-danger mb-2">❌</div>
          <h2 className="text-danger fw-bold mb-2">NO SE PUDO REALIZAR EL PAGO</h2>
          <p className="text-light mb-4">
            Hubo un problema al procesar tu transacción bancaria o la tarjeta fue rechazada.
          </p>
          <Alert variant="danger" className="bg-black text-danger border-danger text-start">
            <strong>Motivo:</strong> Fondos insuficientes o timeout en la pasarela de pago. Tus productos siguen guardados en el carrito.
          </Alert>
          <div className="d-flex justify-content-center gap-3 mt-3">
            <Button variant="warning" className="fw-bold" onClick={() => setEstadoCompra('checkout')}>
              Reintentar Pago
            </Button>
            <Button variant="secondary" onClick={() => navigate('/catalogo')}>
              Volver al Catálogo
            </Button>
          </div>
        </Card>
      </Container>
    );
  }

  // ==========================================
  // VISTA 3: FORMULARIO DE CHECKOUT
  // ==========================================
  return (
    <Container className="my-5" style={{ maxWidth: '850px' }}>
      <h2 className="neon-green fw-bold mb-4 border-bottom border-success pb-2">CHECKOUT - DATOS DE ENVÍO</h2>

      <Card bg="dark" text="white" className="border-secondary p-4 shadow-lg">
        <Form onSubmit={handleProcesarPago}>
          <Row className="g-3">
            <Col md={6}>
              <Form.Label className="small fw-bold">Nombre *</Form.Label>
              <Form.Control
                type="text"
                name="nombre"
                value={datosEnvio.nombre}
                onChange={handleChange}
                className="bg-dark text-white border-secondary"
                required
              />
            </Col>
            <Col md={6}>
              <Form.Label className="small fw-bold">Apellidos *</Form.Label>
              <Form.Control
                type="text"
                name="apellidos"
                placeholder="Ej. Perez"
                value={datosEnvio.apellidos}
                onChange={handleChange}
                className="bg-dark text-white border-secondary"
                required
              />
            </Col>
            <Col md={12}>
              <Form.Label className="small fw-bold">Correo Electrónico *</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={datosEnvio.email}
                onChange={handleChange}
                className="bg-dark text-white border-secondary"
                required
              />
            </Col>

            <Col md={8}>
              <Form.Label className="small fw-bold">Calle y Número *</Form.Label>
              <Form.Control
                type="text"
                name="calle"
                placeholder="Ej. Los Crisantemos, Edificio Norte #1020"
                value={datosEnvio.calle}
                onChange={handleChange}
                className="bg-dark text-white border-secondary"
                required
              />
            </Col>
            <Col md={4}>
              <Form.Label className="small fw-bold">Departamento (opcional)</Form.Label>
              <Form.Control
                type="text"
                name="depto"
                placeholder="Ej. Depto 603"
                value={datosEnvio.depto}
                onChange={handleChange}
                className="bg-dark text-white border-secondary"
              />
            </Col>

            <Col md={6}>
                <Form.Label className="small fw-bold">Región *</Form.Label>
                <Form.Select
                    name="region"
                    value={datosEnvio.region}
                    onChange={handleChange}
                    className="bg-dark text-white border-secondary"
                    required
                >
                    <option value="">Selecciona una región...</option>
                    <option value="Región Metropolitana de Santiago">Región Metropolitana de Santiago</option>
                    <option value="Valparaíso">Valparaíso</option>
                    <option value="Biobío">Biobío</option>
                    <option value="Antofagasta">Antofagasta</option>
                    <option value="La Araucanía">La Araucanía</option>
                    <option value="Los Lagos">Los Lagos</option>
                    <option value="Coquimbo">Coquimbo</option>
                </Form.Select>
            </Col>

            <Col md={12}>
              <Form.Label className="small fw-bold">Indicaciones para la entrega (opcional)</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                name="indicaciones"
                placeholder="Ej. Dejar con el conserje si no hay nadie."
                value={datosEnvio.indicaciones}
                onChange={handleChange}
                className="bg-dark text-white border-secondary"
              />
            </Col>

            {/* CASILLA DE MODO PRUEBA ERROR */}
            <Col md={12} className="mt-3">
              <Card className="bg-black border-danger p-2">
                <Form.Check
                  type="checkbox"
                  id="forzarError"
                  name="forzarError"
                  label={<span className="text-danger small fw-bold">🧪 [Modo Prueba] Simular Pago Rechazado / Fallido</span>}
                  checked={datosEnvio.forzarError}
                  onChange={handleChange}
                />
              </Card>
            </Col>
          </Row>

          <Button variant="success" type="submit" className="btn-neon-green w-100 py-2 fs-5 fw-bold mt-4">
            Realizar Pago (${total.toLocaleString('es-CL')} CLP)
          </Button>
        </Form>
      </Card>
    </Container>
  );
};
