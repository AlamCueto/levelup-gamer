import React, { useState } from 'react';
import { Form, Button, Card, Alert, Badge, Row, Col } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export const RegistroForm = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    password: '',
    confirmPassword: '',
    aceptaTerminos: false
  });
  const [mensaje, setMensaje] = useState({ tipo: '', texto: '' });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const esDuoc =
    formData.email.endsWith('@duoc.cl') ||
    formData.email.endsWith('@duocuc.cl') ||
    formData.email.endsWith('@profesor.duoc.cl');

  const handleSubmit = (e) => {
    e.preventDefault();
    const { nombre, email, password, confirmPassword, aceptaTerminos } = formData;

    if (!nombre || !email || !password || !confirmPassword) {
      setMensaje({ tipo: 'danger', texto: 'Por favor completa todos los campos requeridos.' });
      return;
    }

    if (password.length < 6) {
      setMensaje({ tipo: 'danger', texto: 'La contraseña debe tener al menos 6 caracteres.' });
      return;
    }

    if (password !== confirmPassword) {
      setMensaje({ tipo: 'danger', texto: 'Las contraseñas no coinciden.' });
      return;
    }

    if (!aceptaTerminos) {
      setMensaje({ tipo: 'warning', texto: 'Debes aceptar los términos y condiciones.' });
      return;
    }

    // REGISTRAR EN EL CONTEXTO GLOBAL
    const res = register({
      nombre,
      email,
      password,
      esDuoc,
      role: 'user'
    });

    if (!res.success) {
      setMensaje({ tipo: 'danger', texto: res.message });
      return;
    }

    // Éxito: Redirigir al Inicio tras registrarse
    alert(`¡Bienvenido/a ${nombre}! Tu cuenta se ha creado e iniciado sesión correctamente.`);
    navigate('/');
  };

  return (
    <div className="my-4">
      <Card bg="dark" text="white" className="border-secondary shadow-lg overflow-hidden">
        <Row className="g-0">
          <Col lg={5} className="bg-dark p-4 p-md-5 d-flex flex-column justify-content-between border-end border-secondary">
            <div>
              <Badge bg="success" className="mb-3 px-3 py-2 fs-6">
                SQUAD GAMER DUOC
              </Badge>
              <h2 className="display-6 fw-bold neon-green mb-3">SUBE DE NIVEL CON TU CUENTA</h2>
              <p className="text-light fs-6 mb-4" style={{ color: '#cccccc' }}>
                Regístrate hoy para obtener beneficios exclusivos en periféricos, consolas y armado de PCs.
              </p>

              <div className="d-flex flex-column gap-3">
                <div className="d-flex align-items-center gap-3">
                  <span className="fs-3">🎓</span>
                  <div>
                    <h6 className="mb-0 fw-bold text-white">Descuento Exclusivo Duoc UC</h6>
                    <small className="text-light" style={{ color: '#aaaaaa' }}>20% OFF permanente utilizando tu correo institucional.</small>
                  </div>
                </div>

                <div className="d-flex align-items-center gap-3">
                  <span className="fs-3">🚀</span>
                  <div>
                    <h6 className="mb-0 fw-bold text-white">Envíos Prioritarios Express</h6>
                    <small className="text-light" style={{ color: '#aaaaaa' }}>Despachos en 24-48 horas hábiles a todo Chile.</small>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-top border-secondary text-center text-lg-start">
              <small className="text-light" style={{ color: '#888888' }}>¿Ya eres parte del equipo?</small> <br />
              <Button variant="link" onClick={() => navigate('/login')} className="text-info p-0 fw-bold text-decoration-none">
                Inicia sesión aquí →
              </Button>
            </div>
          </Col>

          <Col lg={7} className="p-4 p-md-5">
            <h3 className="neon-green mb-1 fw-bold">Crear Cuenta Gamer</h3>
            <p className="text-light mb-4 small" style={{ color: '#aaaaaa' }}>Ingresa tus datos para configurar tu perfil de jugador</p>

            {mensaje.texto && (
              <Alert variant={mensaje.tipo} onClose={() => setMensaje({ tipo: '', texto: '' })} dismissible>
                {mensaje.texto}
              </Alert>
            )}

            {esDuoc && (
              <Alert variant="success" className="bg-dark border-success text-success d-flex align-items-center gap-3 mb-4">
                <span className="fs-2">🎉</span>
                <div>
                  <strong className="d-block text-white">¡Correo Duoc UC Detectado!</strong>
                  <span className="small text-success fw-bold">Beneficio aplicado: Tendrás 20% OFF de por vida en todas tus compras.</span>
                </div>
              </Alert>
            )}

            <Form onSubmit={handleSubmit}>
              <Row>
                <Col md={12} className="mb-3">
                  <Form.Label htmlFor="nombre" className="text-light small fw-bold">Nombre Completo *</Form.Label>
                  <Form.Control
                    id="nombre"
                    type="text"
                    name="nombre"
                    placeholder="Ej. Constanza Silva"
                    value={formData.nombre}
                    onChange={handleChange}
                    className="bg-dark text-white border-secondary py-2"
                    required
                  />
                </Col>

                <Col md={12} className="mb-3">
                  <Form.Label htmlFor="email" className="text-light small fw-bold">Correo Electrónico *</Form.Label>
                  <Form.Control
                    id="email"
                    type="email"
                    name="email"
                    placeholder="ejemplo@duocuc.cl o correo personal"
                    value={formData.email}
                    onChange={handleChange}
                    className="bg-dark text-white border-secondary py-2"
                    required
                  />
                </Col>

                <Col md={6} className="mb-3">
                  <Form.Label htmlFor="password" className="text-light small fw-bold">Contraseña *</Form.Label>
                  <Form.Control
                    id="password"
                    type="password"
                    name="password"
                    placeholder="Mínimo 6 caracteres"
                    value={formData.password}
                    onChange={handleChange}
                    className="bg-dark text-white border-secondary py-2"
                    required
                  />
                </Col>

                <Col md={6} className="mb-3">
                  <Form.Label htmlFor="confirmPassword" className="text-light small fw-bold">Confirmar Contraseña *</Form.Label>
                  <Form.Control
                    id="confirmPassword"
                    type="password"
                    name="confirmPassword"
                    placeholder="Repite tu contraseña"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="bg-dark text-white border-secondary py-2"
                    required
                  />
                </Col>

                <Col md={12} className="mb-4">
                  <Form.Check
                    type="checkbox"
                    id="aceptaTerminos"
                    name="aceptaTerminos"
                    label={<span className="text-light small" style={{ color: '#cccccc' }}>Acepto los términos de servicio de Level-Up Gamer</span>}
                    checked={formData.aceptaTerminos}
                    onChange={handleChange}
                  />
                </Col>
              </Row>

              <Button variant="success" type="submit" className="btn-neon-green w-100 py-2 fs-6 fw-bold">
                {esDuoc ? '⚡ Registrarse y Activar 20% OFF Duoc' : 'Registrar Cuenta Gamer'}
              </Button>
            </Form>
          </Col>
        </Row>
      </Card>
    </div>
  );
};