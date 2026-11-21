import React, { useState } from 'react';
import { Form, Button, Card, Alert, Row, Col } from 'react-bootstrap';

export const ContactoForm = () => {
  const [contacto, setContacto] = useState({
    nombre: '',
    email: '',
    asunto: 'Soporte Técnico',
    mensaje: ''
  });
  const [enviado, setEnviado] = useState(false);

  const handleChange = (e) => {
    setContacto({ ...contacto, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (contacto.nombre && contacto.email && contacto.mensaje) {
      setEnviado(true);
      setContacto({ nombre: '', email: '', asunto: 'Soporte Técnico', mensaje: '' });
      setTimeout(() => setEnviado(false), 4000);
    }
  };

  return (
    <Row className="g-4 align-items-stretch">
      <Col md={5}>
        <Card bg="dark" text="white" className="border-secondary h-100 p-3">
          <Card.Body>
            <Card.Title as="h3" className="text-info mb-3">Soporte Level-Up</Card.Title>
            <p className="text-muted">¿Tienes dudas con la configuración de tu PC Gamer o el estado de tu envío?</p>
            <hr className="border-secondary" />
            <p><strong>📍 Ubicación:</strong>Serrano 1105,Melipilla, Región Metropolitana</p>
            <p><strong>📧 Email:</strong> contacto@levelupgamer.cl</p>
            <p><strong>💬 WhatsApp:</strong> +56 2 2354 0560</p>
            <p><strong>⏰ Horario:</strong> Lunes a Viernes de 09:00 a 18:00 hrs</p>
          </Card.Body>
        </Card>
      </Col>

      <Col md={7}>
        <Card bg="dark" text="white" className="border-secondary p-3">
          <Card.Body>
            <Card.Title as="h3" className="text-success mb-3">Envíanos un Mensaje</Card.Title>
            
            {enviado && (
              <Alert variant="success">
                ¡Gracias por contactarnos! Un ejecutivo de soporte te responderá a la brevedad.
              </Alert>
            )}

            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3" controlId="contactoNombre">
                <Form.Label>Nombre</Form.Label>
                <Form.Control
                  type="text"
                  name="nombre"
                  placeholder="Tu nombre"
                  value={contacto.nombre}
                  onChange={handleChange}
                  className="bg-secondary text-white border-dark"
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="contactoEmail">
                <Form.Label>Correo de Contacto</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  placeholder="tu@correo.com"
                  value={contacto.email}
                  onChange={handleChange}
                  className="bg-secondary text-white border-dark"
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="contactoAsunto">
                <Form.Label>Asunto</Form.Label>
                <Form.Select
                  name="asunto"
                  value={contacto.asunto}
                  onChange={handleChange}
                  className="bg-secondary text-white border-dark"
                >
                  <option value="Soporte Técnico">Soporte Técnico</option>
                  <option value="Consulta de Envíos">Consulta de Envíos</option>
                  <option value="Garantías">Garantías y Devoluciones</option>
                  <option value="Convenio Duoc UC">Convenio Duoc UC</option>
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3" controlId="contactoMensaje">
                <Form.Label>Mensaje</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  name="mensaje"
                  placeholder="Escribe los detalles de tu consulta..."
                  value={contacto.mensaje}
                  onChange={handleChange}
                  className="bg-secondary text-white border-dark"
                  required
                />
              </Form.Group>

              <Button variant="outline-success" type="submit" className="w-100 fw-bold">
                Enviar Consulta
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};