import React, { useState } from 'react';
import { Form, Button, Card, Alert, Row, Col, Badge } from 'react-bootstrap';

export const ContactoForm = () => {
  const [contacto, setContacto] = useState({
    nombre: '',
    email: '',
    asunto: 'Soporte Técnico',
    mensaje: ''
  });
  const [enviado, setEnviado] = useState(false);

  // --- Estados del Chatbot con IA Ética ---
  const [chatAbierto, setChatAbierto] = useState(false);
  const [mensajesChat, setMensajesChat] = useState([
    {
      remitente: 'bot',
      texto: '¡Hola! Soy Level-Bot 🤖, tu asistente virtual de Level-Up Gamer. Puedo ayudarte con productos, armado de PC, convenios y soporte. ¿En qué puedo orientarte hoy?'
    }
  ]);
  const [inputChat, setInputChat] = useState('');

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

  // --- MÓDULO DE ÉTICA Y PROCESAMIENTO DE IA ---
  const handleEnviarMensajeChat = (e) => {
    e.preventDefault();
    if (!inputChat.trim()) return;

    const mensajeUsuario = inputChat;
    const nuevosMensajes = [...mensajesChat, { remitente: 'user', texto: mensajeUsuario }];
    setMensajesChat(nuevosMensajes);
    setInputChat('');

    setTimeout(() => {
      const txt = mensajeUsuario.toLowerCase();
      let respuestaBot = '';

      // 1. FILTRO ÉTICO DE SEGURIDAD Y LÍMITES
      const temasProhibidos = [
        'hack', 'crack', 'piratear', 'cheat', 'trampa', 'exploit',
        'insulto', 'politica', 'droga', 'arma', 'ilegal', 'password'
      ];

      const detectaRestriccion = temasProhibidos.some((palabra) => txt.includes(palabra));

      if (detectaRestriccion) {
        respuestaBot =
          '🛡️ **Aviso Ético:** Como asistente de Level-Up Gamer, estoy programado bajo directrices éticas que me impiden hablar o responder sobre actividades ilegales, hacks, trampas o contenido fuera de nuestras políticas de servicio. ¿Puedo ayudarte con algún tema sobre hardware o la tienda?';
      }
      // 2. CONTEXTO DE HARDWARE, TIENDA Y SERVICIOS
      else if (txt.includes('duoc') || txt.includes('descuento') || txt.includes('convenio') || txt.includes('20%')) {
        respuestaBot =
          '🎓 ¡Con tu correo institucional (@duocuc.cl o @profesor.duoc.cl) obtienes un 20% OFF de por vida en todo nuestro catálogo!';
      } else if (txt.includes('envio') || txt.includes('despacho') || txt.includes('demora') || txt.includes('cuanto tarda')) {
        respuestaBot =
          '🚚 Realizamos envíos express en Santiago y Melipilla en 24-48 horas hábiles, y a regiones mediante Starken o Chilexpress.';
      } else if (txt.includes('donde') || txt.includes('ubicacion') || txt.includes('horario') || txt.includes('direccion')) {
        respuestaBot =
          '📍 Nos encontramos en Serrano 1105, Melipilla, Región Metropolitana. Horario: Lunes a Viernes de 09:00 a 18:00 hrs.';
      } else if (txt.includes('garantia') || txt.includes('fallo') || txt.includes('devolucion') || txt.includes('cambio')) {
        respuestaBot =
          '🛡️ Todos los productos cuentan con 6 meses de garantía legal y recambio directo en tienda dentro de los primeros 30 días.';
      } else if (txt.includes('pc') || txt.includes('recomienda') || txt.includes('gpu') || txt.includes('ram') || txt.includes('armar')) {
        respuestaBot =
          '🖥️ Te sugiero revisar nuestra sección de PCs Gamer armados o escribirnos a soporte para asesorarte según tu presupuesto y los juegos que quieras ejecutar.';
      } else if (txt.includes('hola') || txt.includes('buenas') || txt.includes('saludos')) {
        respuestaBot =
          '👋 ¡Hola! ¿Cómo estás? Puedo asesorarte con información de productos, garantía, envíos y convenios de la tienda.';
      } 
      // 3. RESPUESTA POR DEFECTO MANTENIENDO LÍMITES ÉTICOS
      else {
        respuestaBot =
          '🤖 Entiendo tu mensaje. Como IA centrada en el soporte de Level-Up Gamer, mis conocimientos están acotados a asesoría e-commerce, productos gamer y atención al cliente. ¿Te gustaría consultar sobre envíos, garantías o convenios?';
      }

      setMensajesChat((prev) => [...prev, { remitente: 'bot', texto: respuestaBot }]);
    }, 600);
  };

  return (
    <div className="position-relative">
      <Row className="g-4 align-items-stretch">
        {/* COLUMNA IZQUIERDA: Información de contacto y acceso a IA */}
        <Col md={5}>
          <Card bg="dark" text="white" className="border-secondary h-100 p-3 shadow-lg d-flex flex-column justify-content-between">
            <Card.Body>
              <Card.Title as="h3" className="text-info mb-3 fw-bold">
                Soporte Level-Up
              </Card.Title>
              <p className="text-light small mb-3" style={{ color: '#cccccc' }}>
                ¿Tienes dudas con la configuración de tu PC Gamer o el estado de tu envío?
              </p>
              <hr className="border-secondary" />
              <p className="mb-2">
                <strong>📍 Ubicación:</strong> <br />
                <span className="text-light" style={{ color: '#cccccc' }}>Serrano 1105, Melipilla, Región Metropolitana</span>
              </p>
              <p className="mb-2">
                <strong>📧 Email:</strong> <br />
                <span className="text-light" style={{ color: '#cccccc' }}>contacto@levelupgamer.cl</span>
              </p>
              <p className="mb-2">
                <strong>💬 WhatsApp:</strong> <br />
                <span className="text-light" style={{ color: '#cccccc' }}>+56 2 2354 0560</span>
              </p>
              <p className="mb-3">
                <strong>⏰ Horario:</strong> <br />
                <span className="text-light" style={{ color: '#cccccc' }}>Lunes a Viernes de 09:00 a 18:00 hrs</span>
              </p>

              {/* Acceso Rápido al Bot con IA Ética */}
              <Card className="bg-black border-success mt-4 p-3 text-center">
                <Badge bg="success" className="mb-2 w-auto mx-auto px-3 py-1">
                  IA ÉTICA & SOPORTE EN VIVO
                </Badge>
                <h6 className="text-white fw-bold mb-1">¿Necesitas ayuda con tu compra?</h6>
                <p className="small text-light mb-3" style={{ color: '#aaaaaa' }}>
                  Resuelve consultas con Level-Bot dentro de nuestros parámetros de atención.
                </p>
                <Button variant="success" className="btn-neon-green fw-bold" onClick={() => setChatAbierto(true)}>
                  🤖 Iniciar Chat con IA
                </Button>
              </Card>
            </Card.Body>
          </Card>
        </Col>

        {/* COLUMNA DERECHA: Formulario de Contacto */}
        <Col md={7}>
          <Card bg="dark" text="white" className="border-secondary p-3 shadow-lg">
            <Card.Body>
              <Card.Title as="h3" className="text-success mb-3 fw-bold">
                Envíanos un Mensaje
              </Card.Title>

              {enviado && (
                <Alert variant="success" onClose={() => setEnviado(false)} dismissible>
                  ¡Gracias por contactarnos! Un ejecutivo de soporte te responderá a la brevedad.
                </Alert>
              )}

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="contactoNombre">
                  <Form.Label className="text-light small fw-bold">Nombre</Form.Label>
                  <Form.Control
                    type="text"
                    name="nombre"
                    placeholder="Tu nombre"
                    value={contacto.nombre}
                    onChange={handleChange}
                    className="bg-dark text-white border-secondary py-2"
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="contactoEmail">
                  <Form.Label className="text-light small fw-bold">Correo de Contacto</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    placeholder="tu@correo.com"
                    value={contacto.email}
                    onChange={handleChange}
                    className="bg-dark text-white border-secondary py-2"
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="contactoAsunto">
                  <Form.Label className="text-light small fw-bold">Asunto</Form.Label>
                  <Form.Select
                    name="asunto"
                    value={contacto.asunto}
                    onChange={handleChange}
                    className="bg-dark text-white border-secondary py-2"
                  >
                    <option value="Soporte Técnico">Soporte Técnico</option>
                    <option value="Consulta de Envíos">Consulta de Envíos</option>
                    <option value="Garantías">Garantías y Devoluciones</option>
                    <option value="Convenio Duoc UC">Convenio Duoc UC</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-4" controlId="contactoMensaje">
                  <Form.Label className="text-light small fw-bold">Mensaje</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    name="mensaje"
                    placeholder="Escribe los detalles de tu consulta..."
                    value={contacto.mensaje}
                    onChange={handleChange}
                    className="bg-dark text-white border-secondary py-2"
                    required
                  />
                </Form.Group>

                <Button variant="outline-success" type="submit" className="w-100 fw-bold py-2 btn-outline-success">
                  Enviar Consulta
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* BURBUJA FLOTANTE EN LA ESQUINA INFERIOR DERECHA */}
      <div style={{ position: 'fixed', bottom: '25px', right: '25px', zIndex: 1050 }}>
        {!chatAbierto ? (
          <Button
            variant="success"
            className="rounded-circle p-0 shadow-lg d-flex align-items-center justify-content-center"
            style={{ width: '60px', height: '60px', fontSize: '28px', border: '2px solid #00ff66' }}
            onClick={() => setChatAbierto(true)}
            title="Asistente Level-Bot IA (Ético)"
          >
            🤖
          </Button>
        ) : (
          <Card bg="dark" text="white" className="border-success shadow-lg" style={{ width: '340px', height: '430px' }}>
            <Card.Header className="bg-black text-white d-flex justify-content-between align-items-center border-secondary">
              <span className="fw-bold text-success d-flex align-items-center gap-2">
                🤖 Level-Bot (IA Ética)
              </span>
              <Button variant="close" onClick={() => setChatAbierto(false)} />
            </Card.Header>

            <Card.Body className="p-3 overflow-auto d-flex flex-column gap-2" style={{ height: '310px', backgroundColor: '#121212' }}>
              {mensajesChat.map((msg, index) => (
                <div
                  key={index}
                  className={`p-2 rounded ${
                    msg.remitente === 'user'
                      ? 'bg-success text-black align-self-end text-end fw-semibold'
                      : 'bg-dark text-white border border-secondary align-self-start'
                  }`}
                  style={{ maxWidth: '85%', fontSize: '0.85rem' }}
                >
                  {msg.texto}
                </div>
              ))}
            </Card.Body>

            <Card.Footer className="bg-dark border-secondary p-2">
              <Form onSubmit={handleEnviarMensajeChat} className="d-flex gap-2">
                <Form.Control
                  type="text"
                  placeholder="Haz una pregunta a la IA..."
                  value={inputChat}
                  onChange={(e) => setInputChat(e.target.value)}
                  className="bg-black text-white border-secondary py-1 px-2"
                  style={{ fontSize: '0.85rem' }}
                />
                <Button variant="success" type="submit" size="sm" className="btn-neon-green fw-bold">
                  Enviar
                </Button>
              </Form>
            </Card.Footer>
          </Card>
        )}
      </div>
    </div>
  );
};