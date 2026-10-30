import React, { useState } from 'react';
import { Form, Button, Card, Alert } from 'react-bootstrap';

export const RegistroForm = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [mensaje, setMensaje] = useState({ tipo: '', texto: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { nombre, email, password, confirmPassword } = formData;

    if (!nombre || !email || !password) {
      setMensaje({ tipo: 'danger', texto: 'Por favor completa todos los campos requeridos.' });
      return;
    }

    if (password !== confirmPassword) {
      setMensaje({ tipo: 'danger', texto: 'Las contraseñas no coinciden.' });
      return;
    }

    // Validación de Correo Duoc
    const esDuoc = email.endsWith('@duocuc.cl') || email.endsWith('@profesor.duoc.cl');
    
    if (esDuoc) {
      setMensaje({ 
        tipo: 'success', 
        texto: `¡Registro exitoso, ${nombre}! Se ha validado tu correo Duoc UC. Obtienes un 20% de descuento permanente.` 
      });
    } else {
      setMensaje({ 
        tipo: 'warning', 
        texto: `¡Registro exitoso, ${nombre}! Tu cuenta está activa (Nota: Solo correos @duocuc.cl acceden al 20% Off).` 
      });
    }

    setFormData({ nombre: '', email: '', password: '', confirmPassword: '' });
  };

  return (
    <Card bg="dark" text="white" className="border-secondary p-4 mx-auto" style={{ maxWidth: '600px' }}>
      <Card.Body>
        <Card.Title as="h2" className="text-center text-success mb-3">
          Crear Cuenta Gamer
        </Card.Title>
        <Card.Text className="text-center text-muted mb-4">
          ¡Ingresa tu correo institucional <strong>@duocuc.cl</strong> y activa tu 20% de descuento automáticamente!
        </Card.Text>

        {mensaje.texto && <Alert variant={mensaje.tipo}>{mensaje.texto}</Alert>}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formNombre">
            <Form.Label>Nombre Completo</Form.Label>
            <Form.Control
              type="text"
              name="nombre"
              placeholder="Ej: Alan Brito"
              value={formData.nombre}
              onChange={handleChange}
              className="bg-secondary text-white border-dark"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formEmail">
            <Form.Label>Correo Electrónico (Duoc UC)</Form.Label>
            <Form.Control
              type="email"
              name="email"
              placeholder="ejemplo@duocuc.cl"
              value={formData.email}
              onChange={handleChange}
              className="bg-secondary text-white border-dark"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formPassword">
            <Form.Label>Contraseña</Form.Label>
            <Form.Control
              type="password"
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              className="bg-secondary text-white border-dark"
              required
            />
          </Form.Group>

          <Form.Group className="mb-4" controlId="formConfirmPassword">
            <Form.Label>Confirmar Contraseña</Form.Label>
            <Form.Control
              type="password"
              name="confirmPassword"
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="bg-secondary text-white border-dark"
              required
            />
          </Form.Group>

          <Button variant="success" type="submit" className="w-100 fw-bold">
            Registrarse y Obtener Beneficio
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
};