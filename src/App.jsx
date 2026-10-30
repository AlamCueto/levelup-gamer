import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { Container, Navbar, Nav, Badge, Button, Row, Col, Form, Card, Table, Alert, Modal, Pagination, Carousel } from 'react-bootstrap';
import { CartProvider, useCart } from './context/CartContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ProductCard } from './components/ProductCard';
import { ReviewSection } from './components/ReviewSection';
import { CartModal } from './components/CartModal';
import { RegistroForm } from './components/RegistroForm';
import { ContactoForm } from './components/ContactoForm';
import { Checkout } from './pages/Checkout';

// --- Integración de Chart.js ---
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

// --- Header de Navegación ---
const HeaderNav = ({ onOpenCart }) => {
  const { totalItems } = useCart();
  const { user, logout } = useAuth();

  return (
    <Navbar bg="dark" variant="dark" expand="lg" sticky="top" className="border-bottom border-secondary px-3">
      <Container>
        <Navbar.Brand as={Link} to="/" className="fw-bold text-uppercase fs-4">
          LEVEL-UP <span className="neon-green">GAMER</span>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto align-items-center">
            <Nav.Link as={Link} to="/" className="text-white">Inicio</Nav.Link>
            <Nav.Link as={Link} to="/catalogo" className="text-white">Catálogo</Nav.Link>
            <Nav.Link as={Link} to="/registro" className="text-white">Registro (20% Off Duoc)</Nav.Link>
            <Nav.Link as={Link} to="/contacto" className="text-white">Contacto</Nav.Link>

            {user ? (
              <>
                {user.role === 'admin' && (
                  <Nav.Link as={Link} to="/admin" className="text-success fw-bold">
                    Panel Admin
                  </Nav.Link>
                )}
                <span className="text-info ms-2 me-1 fw-bold d-flex align-items-center gap-1">
                  👤 {user.nombre || user.name}
                  {user.esDuoc && <Badge bg="success" className="ms-1">Duoc 20% OFF</Badge>}
                </span>
                <Button variant="outline-danger" size="sm" className="ms-2" onClick={logout}>
                  Salir
                </Button>
              </>
            ) : (
              <Nav.Link as={Link} to="/login" className="text-info fw-bold">
                Iniciar Sesión
              </Nav.Link>
            )}

            <Button variant="outline-success" className="ms-lg-3 mt-2 mt-lg-0 btn-outline-success" onClick={onOpenCart}>
              🛒 Carrito <Badge bg="success" pill>{totalItems}</Badge>
            </Button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

// Datos iniciales de productos
export const productosIniciales = [
  {
    id: 'CO001',
    nombre: 'PlayStation 5',
    precio: 549990,
    descripcion: 'Gráficos 4K e inmersión de última generación con SSD ultrarrápido.',
    imagen: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=500&q=80',
    tag: 'TOP VENTAS',
    tagClase: 'bg-primary'
  },
  {
    id: 'CG001',
    nombre: 'PC Gamer ASUS ROG Strix',
    precio: 1299990,
    descripcion: 'Máxima potencia para juegos competitivos y AAA. Listo para streaming.',
    imagen: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=500&q=80',
    tag: 'BENEFICIO DUOC',
    tagClase: 'bg-success'
  },
  {
    id: 'AC002',
    nombre: 'HyperX Cloud II',
    precio: 79990,
    descripcion: 'Sonido envolvente 7.1, micrófono con cancelación de ruido y gran comodidad.',
    imagen: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=500&q=80',
    tag: 'OFERTA',
    tagClase: 'bg-warning text-dark'
  },
  {
    id: 'SI001',
    nombre: 'Silla Gamer Ergonómica Pro',
    precio: 189990,
    descripcion: 'Respaldo reclinable 180°, cojines lumbar y cervical con bordes neón.',
    imagen: 'https://images.unsplash.com/photo-1598550476439-6847785fcea6?auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 'TE001',
    nombre: 'Teclado Mecánico RGB Switch',
    precio: 69990,
    descripcion: 'Switches mecánicos táctiles de alta durabilidad e iluminación RGB por tecla.',
    imagen: 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 'MO001',
    nombre: 'Mouse Inalámbrico 26K DPI',
    precio: 49990,
    descripcion: 'Sensor óptico de máxima precisión, tiempo de respuesta de 1ms y peso ultraligero.',
    imagen: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=500&q=80',
    tag: 'NUEVO',
    tagClase: 'bg-info'
  }
];

// --- Vista Formulario Login ---
const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (login(email, password)) {
      // Si el usuario autenticado es admin lo envía al panel, de lo contrario al inicio
      if (email.toLowerCase() === 'admin@levelup.cl') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } else {
      setError('Credenciales inválidas. Verifica tu correo y contraseña.');
    }
  };

  return (
    <Card bg="dark" text="white" className="p-4 mx-auto border-secondary my-5 shadow-lg" style={{ maxWidth: '420px' }}>
      <h3 className="text-center neon-green mb-3 fw-bold">Iniciar Sesión</h3>
      {error && <Alert variant="danger" className="py-2 fs-6">{error}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label className="text-light">Correo Electrónico</Form.Label>
          <Form.Control
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="tu@correo.cl"
            className="bg-dark text-white border-secondary"
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label className="text-light">Contraseña</Form.Label>
          <Form.Control
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="••••••••"
            className="bg-dark text-white border-secondary"
          />
        </Form.Group>
        <Button variant="success" type="submit" className="w-100 btn-neon-green fw-bold py-2 mt-2">
          Ingresar a la Squad
        </Button>
      </Form>
      <div className="text-center mt-3 pt-2 border-top border-secondary">
        <small className="text-light" style={{ color: '#aaaaaa' }}>¿No tienes una cuenta aún?</small> <br />
        <Link to="/registro" className="text-info fw-bold text-decoration-none">
          Regístrate aquí con tu beneficio Duoc →
        </Link>
      </div>
    </Card>
  );
};

// --- Panel Admin ---
const AdminPanel = ({ productos, setProductos }) => {
  const { user } = useAuth();

  const [producto, setProducto] = useState({ nombre: '', precio: '', descripcion: '', imagen: '', tag: '' });
  const [mensaje, setMensaje] = useState({ tipo: '', texto: '' });

  const [busqueda, setBusqueda] = useState('');
  const [paginaActual, setPaginaActual] = useState(1);
  const productosPorPagina = 5;

  const [showEditModal, setShowEditModal] = useState(false);
  const [productoEditando, setProductoEditando] = useState(null);

  if (!user || user.role !== 'admin') {
    return <Alert variant="danger" className="text-center my-5">Acceso denegado. Requiere permisos de administrador.</Alert>;
  }

  const totalValor = productos.reduce((acc, item) => acc + Number(item.precio), 0);
  const precioPromedio = productos.length > 0 ? Math.round(totalValor / productos.length) : 0;
  const perdidasEstimadas = Math.round(totalValor * 0.08);

  const dataVentasPerdidas = {
    labels: ['Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre'],
    datasets: [
      {
        label: 'Ingresos por Ventas ($ CLP)',
        data: [4200000, 5800000, 7100000, 6400000, 8900000, 10200000],
        backgroundColor: '#00ff66',
        borderRadius: 5
      },
      {
        label: 'Pérdidas / Mermas / Devoluciones ($ CLP)',
        data: [350000, 280000, 620000, 410000, 530000, 390000],
        backgroundColor: '#ff4d4d',
        borderRadius: 5
      }
    ]
  };

  const dataBalance = {
    labels: ['Ganancia Neta', 'Costo Operativo', 'Pérdidas por Mermas'],
    datasets: [
      {
        data: [65, 27, 8],
        backgroundColor: ['#00ff66', '#00bfff', '#ff4d4d'],
        borderWidth: 2,
        borderColor: '#1a1a1a'
      }
    ]
  };

  const chartOptionsDark = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { labels: { color: '#ffffff', font: { size: 12 } } },
      tooltip: { titleColor: '#fff', bodyColor: '#fff' }
    },
    scales: {
      x: { ticks: { color: '#cccccc' }, grid: { color: '#333333' } },
      y: { ticks: { color: '#cccccc' }, grid: { color: '#333333' } }
    }
  };

  const productosFiltrados = productos.filter(
    (p) =>
      p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      p.id.toLowerCase().includes(busqueda.toLowerCase()) ||
      (p.tag && p.tag.toLowerCase().includes(busqueda.toLowerCase()))
  );

  const indiceUltimo = paginaActual * productosPorPagina;
  const indicePrimer = indiceUltimo - productosPorPagina;
  const productosPaginados = productosFiltrados.slice(indicePrimer, indiceUltimo);
  const totalPaginas = Math.ceil(productosFiltrados.length / productosPorPagina);

  const handleSubmitNuevo = (e) => {
    e.preventDefault();
    if (!producto.nombre.trim() || producto.nombre.length < 3) {
      setMensaje({ tipo: 'danger', texto: 'El nombre debe tener al menos 3 caracteres.' });
      return;
    }
    if (Number(producto.precio) <= 0) {
      setMensaje({ tipo: 'danger', texto: 'El precio debe ser superior a $0.' });
      return;
    }

    const nuevo = {
      ...producto,
      id: `PROD-${Date.now().toString().slice(-4)}`,
      precio: Number(producto.precio),
      tag: producto.tag.toUpperCase() || 'NUEVO',
      tagClase: 'bg-info'
    };

    setProductos([nuevo, ...productos]);
    setMensaje({ tipo: 'success', texto: `¡Producto "${producto.nombre}" añadido con éxito!` });
    setProducto({ nombre: '', precio: '', descripcion: '', imagen: '', tag: '' });
  };

  const handleAbrirEditar = (prod) => {
    setProductoEditando({ ...prod });
    setShowEditModal(true);
  };

  const handleGuardarEdicion = (e) => {
    e.preventDefault();
    setProductos(
      productos.map((item) =>
        item.id === productoEditando.id
          ? { ...productoEditando, precio: Number(productoEditando.precio) }
          : item
      )
    );
    setShowEditModal(false);
    setMensaje({ tipo: 'info', texto: `Se actualizó el producto "${productoEditando.nombre}".` });
  };

  const handleEliminar = (id, nombre) => {
    if (window.confirm(`¿Deseas eliminar permanentemente "${nombre}"?`)) {
      setProductos(productos.filter((p) => p.id !== id));
      setMensaje({ tipo: 'warning', texto: `Producto "${nombre}" eliminado del inventario.` });
    }
  };

  return (
    <section className="my-4">
      <div className="d-flex justify-content-between align-items-center mb-4 border-bottom border-secondary pb-3">
        <div>
          <h2 className="neon-green mb-0 fw-bold">DASHBOARD MÉTRICO & CONTROL ADMIN</h2>
          <p className="text-light mb-0" style={{ color: '#cccccc' }}>
            Análisis de rendimiento, balance de pérdidas e inventario general
          </p>
        </div>
        <Badge bg="success" className="px-3 py-2 fs-6">
          Admin Online
        </Badge>
      </div>

      <Row className="mb-4 g-3">
        <Col md={3}>
          <Card bg="dark" text="white" className="border-secondary h-100 shadow-sm">
            <Card.Body className="d-flex justify-content-between align-items-center">
              <div>
                <p className="text-light mb-1 text-uppercase fw-bold small">Catálogo Activo</p>
                <h3 className="neon-green mb-0 fw-bold">{productos.length} UNID.</h3>
              </div>
              <div className="fs-1">📦</div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={3}>
          <Card bg="dark" text="white" className="border-secondary h-100 shadow-sm">
            <Card.Body className="d-flex justify-content-between align-items-center">
              <div>
                <p className="text-light mb-1 text-uppercase fw-bold small">Valor Inventario</p>
                <h3 className="text-info mb-0 fw-bold">${totalValor.toLocaleString('es-CL')}</h3>
              </div>
              <div className="fs-1">💰</div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={3}>
          <Card bg="dark" text="white" className="border-secondary h-100 shadow-sm">
            <Card.Body className="d-flex justify-content-between align-items-center">
              <div>
                <p className="text-light mb-1 text-uppercase fw-bold small">Precio Promedio</p>
                <h3 className="text-warning mb-0 fw-bold">${precioPromedio.toLocaleString('es-CL')}</h3>
              </div>
              <div className="fs-1">📊</div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={3}>
          <Card bg="dark" text="white" className="border-danger h-100 shadow-sm">
            <Card.Body className="d-flex justify-content-between align-items-center">
              <div>
                <p className="text-danger mb-1 text-uppercase fw-bold small">PÉRDIDAS EST. (DEVOLUCIONES)</p>
                <h3 className="text-danger mb-0 fw-bold">${perdidasEstimadas.toLocaleString('es-CL')}</h3>
              </div>
              <div className="fs-1">📉</div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mb-4 g-4">
        <Col lg={8}>
          <Card bg="dark" text="white" className="p-3 border-secondary shadow-sm h-100">
            <h5 className="neon-green mb-3 fw-bold">📈 BALANCE COMPARATIVO: VENTAS MENSUALES VS PÉRDIDAS</h5>
            <div style={{ height: '280px' }}>
              <Bar data={dataVentasPerdidas} options={chartOptionsDark} />
            </div>
          </Card>
        </Col>

        <Col lg={4}>
          <Card bg="dark" text="white" className="p-3 border-secondary shadow-sm h-100">
            <h5 className="text-info mb-3 fw-bold">🍩 DISTRIBUCIÓN DE RENTABILIDAD</h5>
            <div style={{ height: '250px' }} className="d-flex justify-content-center">
              <Doughnut data={dataBalance} options={{ ...chartOptionsDark, maintainAspectRatio: false }} />
            </div>
          </Card>
        </Col>
      </Row>

      {mensaje.texto && (
        <Alert variant={mensaje.tipo} onClose={() => setMensaje({ tipo: '', texto: '' })} dismissible>
          {mensaje.texto}
        </Alert>
      )}

      <Row className="g-4">
        <Col lg={4}>
          <Card bg="dark" text="white" className="p-3 border-secondary shadow-sm">
            <h5 className="text-success mb-3 fw-bold">➕ Publicar Producto</h5>
            <Form onSubmit={handleSubmitNuevo}>
              <Form.Group className="mb-2">
                <Form.Label className="small text-light mb-1">Nombre *</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Nombre del producto"
                  value={producto.nombre}
                  onChange={(e) => setProducto({ ...producto, nombre: e.target.value })}
                  className="bg-dark text-white border-secondary"
                  required
                />
              </Form.Group>

              <Form.Group className="mb-2">
                <Form.Label className="small text-light mb-1">Precio ($ CLP) *</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Ej. 49990"
                  value={producto.precio}
                  onChange={(e) => setProducto({ ...producto, precio: e.target.value })}
                  className="bg-dark text-white border-secondary"
                  required
                />
              </Form.Group>

              <Form.Group className="mb-2">
                <Form.Label className="small text-light mb-1">URL de Imagen *</Form.Label>
                <Form.Control
                  type="url"
                  placeholder="https://..."
                  value={producto.imagen}
                  onChange={(e) => setProducto({ ...producto, imagen: e.target.value })}
                  className="bg-dark text-white border-secondary"
                  required
                />
              </Form.Group>

              <Form.Group className="mb-2">
                <Form.Label className="small text-light mb-1">Etiqueta / Tag</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Ej: OFERTA, TOP VENTAS"
                  value={producto.tag}
                  onChange={(e) => setProducto({ ...producto, tag: e.target.value })}
                  className="bg-dark text-white border-secondary"
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label className="small text-light mb-1">Descripción *</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={2}
                  placeholder="Escribe detalles del producto..."
                  value={producto.descripcion}
                  onChange={(e) => setProducto({ ...producto, descripcion: e.target.value })}
                  className="bg-dark text-white border-secondary"
                  required
                />
              </Form.Group>

              <Button variant="success" type="submit" className="btn-neon-green w-100 fw-bold">
                Guardar Producto
              </Button>
            </Form>
          </Card>
        </Col>

        <Col lg={8}>
          <Card bg="dark" text="white" className="p-3 border-secondary shadow-sm">
            <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center mb-3 gap-2">
              <h5 className="text-info mb-0 fw-bold">🗂️ Gestión de Inventario</h5>
              <Form.Control
                type="text"
                placeholder="🔍 Buscar producto..."
                value={busqueda}
                onChange={(e) => {
                  setBusqueda(e.target.value);
                  setPaginaActual(1);
                }}
                className="bg-dark text-white border-secondary"
                style={{ maxWidth: '280px' }}
              />
            </div>

            <div className="table-responsive">
              <Table striped bordered hover variant="dark" className="align-middle text-center mb-0">
                <thead>
                  <tr className="border-secondary text-light small">
                    <th>Imagen</th>
                    <th>ID</th>
                    <th className="text-start">Producto</th>
                    <th>Etiqueta</th>
                    <th>Precio</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {productosPaginados.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="py-4 text-light">
                        No se encontraron productos en la búsqueda.
                      </td>
                    </tr>
                  ) : (
                    productosPaginados.map((prod) => (
                      <tr key={prod.id}>
                        <td>
                          <img
                            src={prod.imagen}
                            alt={prod.nombre}
                            style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }}
                          />
                        </td>
                        <td className="small text-light fw-monospace">{prod.id}</td>
                        <td className="fw-bold text-start text-white">{prod.nombre}</td>
                        <td>
                          {prod.tag ? <Badge bg="secondary">{prod.tag}</Badge> : <span className="text-light small">-</span>}
                        </td>
                        <td className="text-success fw-bold">${Number(prod.precio).toLocaleString('es-CL')}</td>
                        <td>
                          <div className="d-flex justify-content-center gap-1">
                            <Button variant="outline-warning" size="sm" onClick={() => handleAbrirEditar(prod)}>
                              ✏️
                            </Button>
                            <Button variant="outline-danger" size="sm" onClick={() => handleEliminar(prod.id, prod.nombre)}>
                              🗑️
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </Table>
            </div>

            {totalPaginas > 1 && (
              <div className="d-flex justify-content-center mt-3">
                <Pagination variant="dark">
                  {[...Array(totalPaginas)].map((_, idx) => (
                    <Pagination.Item
                      key={idx + 1}
                      active={idx + 1 === paginaActual}
                      onClick={() => setPaginaActual(idx + 1)}
                    >
                      {idx + 1}
                    </Pagination.Item>
                  ))}
                </Pagination>
              </div>
            )}
          </Card>
        </Col>
      </Row>

      {productoEditando && (
        <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered>
          <Modal.Header closeButton className="bg-dark text-white border-secondary">
            <Modal.Title className="neon-green">Editar Producto ({productoEditando.id})</Modal.Title>
          </Modal.Header>
          <Form onSubmit={handleGuardarEdicion}>
            <Modal.Body className="bg-dark text-white">
              <Form.Group className="mb-2">
                <Form.Label className="text-light">Nombre</Form.Label>
                <Form.Control
                  type="text"
                  value={productoEditando.nombre}
                  onChange={(e) => setProductoEditando({ ...productoEditando, nombre: e.target.value })}
                  className="bg-dark text-white border-secondary"
                  required
                />
              </Form.Group>

              <Form.Group className="mb-2">
                <Form.Label className="text-light">Precio ($ CLP)</Form.Label>
                <Form.Control
                  type="number"
                  value={productoEditando.precio}
                  onChange={(e) => setProductoEditando({ ...productoEditando, precio: e.target.value })}
                  className="bg-dark text-white border-secondary"
                  required
                />
              </Form.Group>

              <Form.Group className="mb-2">
                <Form.Label className="text-light">URL de Imagen</Form.Label>
                <Form.Control
                  type="url"
                  value={productoEditando.imagen}
                  onChange={(e) => setProductoEditando({ ...productoEditando, imagen: e.target.value })}
                  className="bg-dark text-white border-secondary"
                  required
                />
              </Form.Group>

              <Form.Group className="mb-2">
                <Form.Label className="text-light">Etiqueta / Tag</Form.Label>
                <Form.Control
                  type="text"
                  value={productoEditando.tag || ''}
                  onChange={(e) => setProductoEditando({ ...productoEditando, tag: e.target.value })}
                  className="bg-dark text-white border-secondary"
                />
              </Form.Group>

              <Form.Group className="mb-2">
                <Form.Label className="text-light">Descripción</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={productoEditando.descripcion}
                  onChange={(e) => setProductoEditando({ ...productoEditando, descripcion: e.target.value })}
                  className="bg-dark text-white border-secondary"
                  required
                />
              </Form.Group>
            </Modal.Body>
            <Modal.Footer className="bg-dark border-secondary">
              <Button variant="secondary" onClick={() => setShowEditModal(false)}>
                Cancelar
              </Button>
              <Button variant="success" type="submit">
                Actualizar
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>
      )}
    </section>
  );
};

// --- Vista Home Profesional ---
const Home = ({ productos }) => {
  const { addToCart } = useCart();
  const [categoriaSel, setCategoriaSel] = useState('TODOS');

  const categorias = [
    { id: 'TODOS', nombre: 'Todo el Setup', icono: '🎮' },
    { id: 'CONSOLAS', nombre: 'Consolas', icono: '🕹️' },
    { id: 'PC', nombre: 'PCs Gamer', icono: '🖥️' },
    { id: 'PERIFERICOS', nombre: 'Periféricos', icono: '🎧' },
    { id: 'SILLAS', nombre: 'Sillas Gamer', icono: '💺' }
  ];

  const productosFiltrados = productos.filter((prod) => {
    if (categoriaSel === 'TODOS') return true;
    if (categoriaSel === 'CONSOLAS') return prod.id.startsWith('CO');
    if (categoriaSel === 'PC') return prod.id.startsWith('CG');
    if (categoriaSel === 'PERIFERICOS') return prod.id.startsWith('AC') || prod.id.startsWith('TE') || prod.id.startsWith('MO');
    if (categoriaSel === 'SILLAS') return prod.id.startsWith('SI');
    return true;
  });

  return (
    <>
      {/* 1. Carrusel Banner Hero */}
      <section className="mb-5">
        <Carousel fade interval={4000} className="rounded shadow-lg overflow-hidden border border-secondary">
          <Carousel.Item style={{ height: '360px', backgroundColor: '#0d0d0d' }}>
            <div className="d-flex h-100 align-items-center justify-content-between p-4 p-md-5">
              <div style={{ maxWidth: '600px' }}>
                <Badge bg="success" className="mb-2 px-3 py-2 fs-6">
                  BENEFICIO DUOC UC ACTIVADO
                </Badge>
                <h1 className="display-5 fw-bold text-white mb-3">
                  OBTÉN UN <span className="neon-green">20% DE DESCUENTO</span> DE POR VIDA
                </h1>
                <p className="lead text-light mb-4" style={{ color: '#cccccc' }}>
                  Regístrate con tu correo <strong>@duocuc.cl</strong> o <strong>@profesor.duoc.cl</strong> y equipa tu setup con precio preferencial.
                </p>
                <Button variant="success" size="lg" as={Link} to="/registro" className="btn-neon-green fw-bold">
                  Crear Cuenta y Aplicar Dcto →
                </Button>
              </div>
              <div className="d-none d-md-block fs-1 text-center pe-5">🎓🎮</div>
            </div>
          </Carousel.Item>

          <Carousel.Item style={{ height: '360px', backgroundColor: '#0a192f' }}>
            <div className="d-flex h-100 align-items-center justify-content-between p-4 p-md-5">
              <div style={{ maxWidth: '600px' }}>
                <Badge bg="info" className="mb-2 px-3 py-2 fs-6 text-dark fw-bold">
                  NUEVO INGRESO SQUAD
                </Badge>
                <h1 className="display-5 fw-bold text-white mb-3">
                  HARDWARE DE <span className="text-info">ÚLTIMA GENERACIÓN</span>
                </h1>
                <p className="lead text-light mb-4" style={{ color: '#cccccc' }}>
                  Monitores 240Hz, teclados mecánicos custom y tarjetas de video listas para streaming y esports.
                </p>
                <Button variant="info" size="lg" as={Link} to="/catalogo" className="fw-bold text-dark">
                  Explorar Lanzamientos →
                </Button>
              </div>
              <div className="d-none d-md-block fs-1 text-center pe-5">⚡🖥️</div>
            </div>
          </Carousel.Item>
        </Carousel>
      </section>

      {/* 2. Barra de Garantías */}
      <section className="mb-5">
        <Row className="g-3">
          <Col md={3} sm={6}>
            <Card bg="dark" text="white" className="border-secondary h-100 p-2 text-center">
              <Card.Body className="p-2">
                <div className="fs-2 mb-1">🚚</div>
                <h6 className="fw-bold mb-1 text-white">Despacho Express</h6>
                <small className="text-light" style={{ color: '#aaaaaa' }}>Envíos a todo Chile en 24-48 hrs.</small>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3} sm={6}>
            <Card bg="dark" text="white" className="border-secondary h-100 p-2 text-center">
              <Card.Body className="p-2">
                <div className="fs-2 mb-1">🛡️</div>
                <h6 className="fw-bold mb-1 text-white">Garantía Directa</h6>
                <small className="text-light" style={{ color: '#aaaaaa' }}>Soporte postventa e intercambio en 30 días.</small>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3} sm={6}>
            <Card bg="dark" text="white" className="border-secondary h-100 p-2 text-center">
              <Card.Body className="p-2">
                <div className="fs-2 mb-1">💳</div>
                <h6 className="fw-bold mb-1 text-white">Pago Seguro</h6>
                <small className="text-light" style={{ color: '#aaaaaa' }}>Hasta 12 cuotas sin interés con Webpay.</small>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3} sm={6}>
            <Card bg="dark" text="white" className="border-secondary h-100 p-2 text-center">
              <Card.Body className="p-2">
                <div className="fs-2 mb-1">⭐</div>
                <h6 className="fw-bold mb-1 text-white">Comunidad Duoc</h6>
                <small className="text-light" style={{ color: '#aaaaaa' }}>Más de 5.000 estudiantes ya equipados.</small>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </section>

      {/* 3. Categorías y Grilla */}
      <section className="mb-5">
        <div className="d-flex justify-content-between align-items-center mb-3 border-bottom border-success pb-2">
          <h2 className="neon-green fw-bold mb-0">Lo más Buscado en la Squad</h2>
          <span className="text-light small" style={{ color: '#aaaaaa' }}>Mostrando {productosFiltrados.length} productos</span>
        </div>

        <div className="d-flex flex-wrap gap-2 mb-4">
          {categorias.map((cat) => (
            <Button
              key={cat.id}
              variant={categoriaSel === cat.id ? 'success' : 'outline-secondary'}
              className={categoriaSel === cat.id ? 'btn-neon-green fw-bold' : 'text-white'}
              onClick={() => setCategoriaSel(cat.id)}
            >
              {cat.icono} {cat.nombre}
            </Button>
          ))}
        </div>

        <Row xs={1} md={2} lg={3} className="g-4">
          {productosFiltrados.map((prod) => (
            <Col key={prod.id}>
              <ProductCard {...prod} onAddToCart={addToCart} />
            </Col>
          ))}
        </Row>
      </section>

      <ReviewSection />
    </>
  );
};

// Vista Catálogo
const Catalogo = ({ productos }) => {
  const { addToCart } = useCart();

  return (
    <section className="mb-5">
      <h2 className="border-bottom border-success pb-2 mb-4 neon-green">Catálogo Completo de Productos</h2>
      <Row xs={1} md={2} lg={3} className="g-4">
        {productos.map((prod) => (
          <Col key={prod.id}>
            <ProductCard {...prod} onAddToCart={addToCart} />
          </Col>
        ))}
      </Row>
    </section>
  );
};

// Contenedor General
const MainContent = () => {
  const [showCart, setShowCart] = useState(false);
  const [productos, setProductos] = useState(productosIniciales);

  return (
    <Router>
      <div className="bg-black text-white min-vh-100 d-flex flex-column">
        <HeaderNav onOpenCart={() => setShowCart(true)} />

        <Container className="my-4 flex-grow-1">
          <Routes>
            <Route path="/" element={<Home productos={productos} />} />
            <Route path="/catalogo" element={<Catalogo productos={productos} />} />
            <Route path="/registro" element={<RegistroForm />} />
            <Route path="/contacto" element={<ContactoForm />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/admin" element={<AdminPanel productos={productos} setProductos={setProductos} />} />
            <Route path="/checkout" element={<Checkout />} />
          </Routes>
        </Container>

        <footer className="bg-dark text-light py-4 border-top border-secondary mt-auto">
          <Container className="text-center">
            <p className="mb-0" style={{ color: '#aaaaaa' }}>&copy; 2026 Level-Up Gamer. Todos los derechos reservados.</p>
          </Container>
        </footer>

        <CartModal show={showCart} handleClose={() => setShowCart(false)} />
      </div>
    </Router>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <MainContent />
      </CartProvider>
    </AuthProvider>
  );
}