import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import { Container, Navbar, Nav, Badge, Button, Row, Col, Form, Card, Table, Alert, Modal, Pagination, Carousel, Spinner } from 'react-bootstrap';
import { CartProvider, useCart } from './context/CartContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ProductCard } from './components/ProductCard';
import { ReviewSection } from './components/ReviewSection';
import { CartModal } from './components/CartModal';
import { RegistroForm } from './components/RegistroForm';
import { ContactoForm } from './components/ContactoForm';
import { Checkout } from './pages/Checkout';
import { listarProductos, crearProducto, actualizarProducto, eliminarProducto } from './servicios/productos';
import { listarPedidos } from './servicios/pedidos';
import { mensajeDeError } from './servicios/errores';

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

const getUserRol = (user) => user?.rol || user?.role || null;

// --- Componente RutaProtegida ---
const RutaProtegida = ({ rolesPermitidos, children }) => {
  const { user } = useAuth();
  const rol = getUserRol(user);

  if (!user || !rol) {
    return <Navigate to="/login" replace />;
  }

  if (rolesPermitidos && !rolesPermitidos.includes(rol)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

// --- Header de Navegación (Navbar) ---
const HeaderNav = ({ onOpenCart }) => {
  const { totalItems } = useCart();
  const { user, logout } = useAuth();
  const rol = getUserRol(user);

  const esAdmin = rol === 'ROLE_ADMIN';
  const esVendedor = rol === 'ROLE_VENDEDOR';
  const esCliente = rol === 'ROLE_CLIENTE';

  // VENDEDOR solo ve Productos (solo lectura) y Órdenes; sin carrito/compra
  const mostrarCarrito = !esVendedor;

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
            <Nav.Link as={Link} to="/catalogo" className="text-white">
              {esVendedor ? 'Productos' : 'Catálogo'}
            </Nav.Link>

            {!esVendedor && (
              <>
                <Nav.Link as={Link} to="/registro" className="text-white">Registro (20% Off Duoc)</Nav.Link>
                <Nav.Link as={Link} to="/contacto" className="text-white">Contacto</Nav.Link>
              </>
            )}

            {(esAdmin || esVendedor) && (
              <Nav.Link as={Link} to="/ordenes" className="text-info fw-bold">
                Órdenes
              </Nav.Link>
            )}

            {esAdmin && (
              <Nav.Link as={Link} to="/admin" className="text-success fw-bold">
                Administrar
              </Nav.Link>
            )}

            {user ? (
              <>
                <span className="text-info ms-2 me-1 fw-bold d-flex align-items-center gap-1">
                  👤 {user.nombre || user.email}
                  {esCliente && user.esDuoc && <Badge bg="success" className="ms-1">Duoc 20% OFF</Badge>}
                  {rol && <Badge bg="secondary" className="ms-1">{rol.replace('ROLE_', '')}</Badge>}
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

            {mostrarCarrito && (
              <Button variant="outline-success" className="ms-lg-3 mt-2 mt-lg-0" onClick={onOpenCart}>
                🛒 Carrito <Badge bg="success" pill>{totalItems}</Badge>
              </Button>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

// --- Vista Formulario Login ---
const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setCargando(true);
    const usuarioAutenticado = await login(email, password);
    setCargando(false);

    if (usuarioAutenticado) {
      const rolActual = getUserRol(usuarioAutenticado);
      if (rolActual === 'ROLE_ADMIN') {
        navigate('/admin');
      } else if (rolActual === 'ROLE_VENDEDOR') {
        navigate('/ordenes');
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
        <Button variant="success" type="submit" disabled={cargando} className="w-100 btn-neon-green fw-bold py-2 mt-2">
          {cargando ? 'Validando JWT...' : 'Ingresar a la Squad'}
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

// --- Subvista: Nuevo Producto (/admin/nuevo) ---
const NuevoProductoView = ({ onRecargar }) => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ nombre: '', categoria: 'computacion', precio: '', stock: 10, descripcion: '', emoji: '🎮' });
  const [error, setError] = useState('');
  const [guardando, setGuardando] = useState(false);

  const handleCrear = async (e) => {
    e.preventDefault();
    setError('');
    setGuardando(true);
    try {
      await crearProducto({
        nombre: form.nombre.trim(),
        categoria: form.categoria,
        precio: Number(form.precio),
        stock: Number(form.stock),
        descripcion: form.descripcion.trim(),
        emoji: form.emoji.trim() || '🎮',
      });
      await onRecargar();
      navigate('/admin');
    } catch (err) {
      setError(mensajeDeError(err));
    } finally {
      setGuardando(false);
    }
  };

  return (
    <Card bg="dark" text="white" className="p-4 my-4 border-secondary mx-auto" style={{ maxWidth: '640px' }}>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 className="neon-green fw-bold mb-0">➕ Nuevo Producto</h3>
        <Button variant="outline-secondary" size="sm" as={Link} to="/admin">
          ← Volver a Administrar
        </Button>
      </div>
      {error && <Alert variant="danger">{error}</Alert>}
      <Form onSubmit={handleCrear}>
        <Form.Group className="mb-3">
          <Form.Label>Nombre *</Form.Label>
          <Form.Control
            type="text"
            value={form.nombre}
            onChange={(e) => setForm({ ...form, nombre: e.target.value })}
            className="bg-dark text-white border-secondary"
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Categoría *</Form.Label>
          <Form.Select
            value={form.categoria}
            onChange={(e) => setForm({ ...form, categoria: e.target.value })}
            className="bg-dark text-white border-secondary"
          >
            <option value="audio">Audio</option>
            <option value="computacion">Computación</option>
            <option value="hogar">Hogar</option>
          </Form.Select>
        </Form.Group>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Precio ($ CLP) *</Form.Label>
              <Form.Control
                type="number"
                value={form.precio}
                onChange={(e) => setForm({ ...form, precio: e.target.value })}
                className="bg-dark text-white border-secondary"
                required
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Stock *</Form.Label>
              <Form.Control
                type="number"
                value={form.stock}
                onChange={(e) => setForm({ ...form, stock: e.target.value })}
                className="bg-dark text-white border-secondary"
                required
              />
            </Form.Group>
          </Col>
        </Row>
        <Form.Group className="mb-3">
          <Form.Label>Emoji / Ícono</Form.Label>
          <Form.Control
            type="text"
            value={form.emoji}
            onChange={(e) => setForm({ ...form, emoji: e.target.value })}
            className="bg-dark text-white border-secondary"
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Descripción *</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            value={form.descripcion}
            onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
            className="bg-dark text-white border-secondary"
            required
          />
        </Form.Group>
        <Button variant="success" type="submit" disabled={guardando} className="btn-neon-green fw-bold">
          {guardando ? 'Guardando en MySQL...' : 'Guardar Producto'}
        </Button>
      </Form>
    </Card>
  );
};

// --- Subvista: Editar Producto (/admin/editar/:id) ---
const EditarProductoView = ({ productos, onRecargar }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const encontrado = productos.find((p) => String(p.id) === String(id));
  const [form, setForm] = useState(encontrado || null);
  const [error, setError] = useState('');

  if (!form) {
    return (
      <Alert variant="warning" className="my-4">
        Producto no encontrado. <Link to="/admin">Volver a Administrar</Link>
      </Alert>
    );
  }

  const handleActualizar = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await actualizarProducto(id, {
        nombre: form.nombre.trim(),
        categoria: form.categoria,
        precio: Number(form.precio),
        stock: Number(form.stock ?? 0),
        descripcion: form.descripcion,
        emoji: form.emoji || '🎮',
      });
      await onRecargar();
      navigate('/admin');
    } catch (err) {
      setError(mensajeDeError(err));
    }
  };

  return (
    <Card bg="dark" text="white" className="p-4 my-4 border-secondary mx-auto" style={{ maxWidth: '640px' }}>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 className="text-warning fw-bold mb-0">✏️ Editar Producto (#{form.id})</h3>
        <Button variant="outline-secondary" size="sm" as={Link} to="/admin">
          ← Volver a Administrar
        </Button>
      </div>
      {error && <Alert variant="danger">{error}</Alert>}
      <Form onSubmit={handleActualizar}>
        <Form.Group className="mb-3">
          <Form.Label>Nombre</Form.Label>
          <Form.Control
            type="text"
            value={form.nombre}
            onChange={(e) => setForm({ ...form, nombre: e.target.value })}
            className="bg-dark text-white border-secondary"
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Categoría</Form.Label>
          <Form.Select
            value={form.categoria}
            onChange={(e) => setForm({ ...form, categoria: e.target.value })}
            className="bg-dark text-white border-secondary"
          >
            <option value="audio">Audio</option>
            <option value="computacion">Computación</option>
            <option value="hogar">Hogar</option>
          </Form.Select>
        </Form.Group>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Precio ($ CLP)</Form.Label>
              <Form.Control
                type="number"
                value={form.precio}
                onChange={(e) => setForm({ ...form, precio: e.target.value })}
                className="bg-dark text-white border-secondary"
                required
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Stock</Form.Label>
              <Form.Control
                type="number"
                value={form.stock ?? 0}
                onChange={(e) => setForm({ ...form, stock: e.target.value })}
                className="bg-dark text-white border-secondary"
                required
              />
            </Form.Group>
          </Col>
        </Row>
        <Form.Group className="mb-3">
          <Form.Label>Emoji</Form.Label>
          <Form.Control
            type="text"
            value={form.emoji || ''}
            onChange={(e) => setForm({ ...form, emoji: e.target.value })}
            className="bg-dark text-white border-secondary"
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Descripción</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            value={form.descripcion || ''}
            onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
            className="bg-dark text-white border-secondary"
          />
        </Form.Group>
        <Button variant="warning" type="submit" className="fw-bold">
          Guardar Cambios
        </Button>
      </Form>
    </Card>
  );
};

// --- Panel Admin (solo ROLE_ADMIN, conectado a MySQL) ---
const AdminPanel = ({ productos, onRecargar }) => {
  const { user } = useAuth();
  const rol = getUserRol(user);

  const [producto, setProducto] = useState({ nombre: '', categoria: 'computacion', precio: '', stock: 10, descripcion: '', emoji: '🎮' });
  const [mensaje, setMensaje] = useState({ tipo: '', texto: '' });

  const [busqueda, setBusqueda] = useState('');
  const [paginaActual, setPaginaActual] = useState(1);
  const productosPorPagina = 6;

  const [showEditModal, setShowEditModal] = useState(false);
  const [productoEditando, setProductoEditando] = useState(null);

  if (rol !== 'ROLE_ADMIN') {
    return <Navigate to="/" replace />;
  }

  const totalValor = productos.reduce((acc, item) => acc + Number(item.precio) * Number(item.stock ?? 1), 0);
  const precioPromedio = productos.length > 0 ? Math.round(productos.reduce((a, b) => a + Number(b.precio), 0) / productos.length) : 0;
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
        label: 'Pérdidas / Mermas ($ CLP)',
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
    },
    scales: {
      x: { ticks: { color: '#cccccc' }, grid: { color: '#333333' } },
      y: { ticks: { color: '#cccccc' }, grid: { color: '#333333' } }
    }
  };

  const productosFiltrados = productos.filter(
    (p) =>
      p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      String(p.id).includes(busqueda) ||
      (p.categoria && p.categoria.toLowerCase().includes(busqueda.toLowerCase()))
  );

  const indiceUltimo = paginaActual * productosPorPagina;
  const indicePrimer = indiceUltimo - productosPorPagina;
  const productosPaginados = productosFiltrados.slice(indicePrimer, indiceUltimo);
  const totalPaginas = Math.ceil(productosFiltrados.length / productosPorPagina);

  const handleSubmitNuevo = async (e) => {
    e.preventDefault();
    try {
      await crearProducto({
        nombre: producto.nombre.trim(),
        categoria: producto.categoria,
        precio: Number(producto.precio),
        stock: Number(producto.stock),
        descripcion: producto.descripcion.trim(),
        emoji: producto.emoji.trim() || '🎮',
      });
      await onRecargar();
      setMensaje({ tipo: 'success', texto: `¡Producto "${producto.nombre}" guardado en MySQL!` });
      setProducto({ nombre: '', categoria: 'computacion', precio: '', stock: 10, descripcion: '', emoji: '🎮' });
    } catch (err) {
      setMensaje({ tipo: 'danger', texto: mensajeDeError(err) });
    }
  };

  const handleAbrirEditar = (prod) => {
    setProductoEditando({ ...prod });
    setShowEditModal(true);
  };

  const handleGuardarEdicion = async (e) => {
    e.preventDefault();
    try {
      await actualizarProducto(productoEditando.id, {
        nombre: productoEditando.nombre.trim(),
        categoria: productoEditando.categoria,
        precio: Number(productoEditando.precio),
        stock: Number(productoEditando.stock ?? 0),
        descripcion: productoEditando.descripcion,
        emoji: productoEditando.emoji || '🎮',
      });
      await onRecargar();
      setShowEditModal(false);
      setMensaje({ tipo: 'info', texto: `Producto "${productoEditando.nombre}" actualizado en MySQL.` });
    } catch (err) {
      setMensaje({ tipo: 'danger', texto: mensajeDeError(err) });
    }
  };

  const handleEliminar = async (id, nombre) => {
    if (window.confirm(`¿Deseas eliminar permanentemente "${nombre}"?`)) {
      try {
        await eliminarProducto(id);
        await onRecargar();
        setMensaje({ tipo: 'warning', texto: `Producto "${nombre}" eliminado de MySQL.` });
      } catch (err) {
        setMensaje({ tipo: 'danger', texto: mensajeDeError(err) });
      }
    }
  };

  return (
    <section className="my-4">
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 border-bottom border-secondary pb-3 gap-2">
        <div>
          <h2 className="neon-green mb-0 fw-bold">DASHBOARD MÉTRICO & CONTROL ADMIN</h2>
          <p className="text-light mb-0" style={{ color: '#cccccc' }}>
            Conectado en tiempo real a Spring Boot + MySQL (JWT Admin)
          </p>
        </div>
        <div className="d-flex align-items-center gap-2">
          <Button as={Link} to="/admin/nuevo" variant="success" size="sm" className="btn-neon-green fw-bold">
            + Nuevo producto
          </Button>
          <Button as={Link} to="/ordenes" variant="outline-info" size="sm" className="fw-bold">
            Ver Órdenes
          </Button>
          <Badge bg="success" className="px-3 py-2 fs-6">
            Admin Online
          </Badge>
        </div>
      </div>

      <Row className="mb-4 g-3">
        <Col md={3}>
          <Card bg="dark" text="white" className="border-secondary h-100 shadow-sm">
            <Card.Body className="d-flex justify-content-between align-items-center">
              <div>
                <p className="text-light mb-1 text-uppercase fw-bold small">Productos en BD</p>
                <h3 className="neon-green mb-0 fw-bold">{productos.length} SKU</h3>
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
                <p className="text-danger mb-1 text-uppercase fw-bold small">Pérdidas Est.</p>
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
            <h5 className="neon-green mb-3 fw-bold">📈 BALANCE COMPARATIVO: VENTAS VS PÉRDIDAS</h5>
            <div style={{ height: '260px' }}>
              <Bar data={dataVentasPerdidas} options={chartOptionsDark} />
            </div>
          </Card>
        </Col>
        <Col lg={4}>
          <Card bg="dark" text="white" className="p-3 border-secondary shadow-sm h-100">
            <h5 className="text-info mb-3 fw-bold">🍩 RENTABILIDAD</h5>
            <div style={{ height: '240px' }} className="d-flex justify-content-center">
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
                  value={producto.nombre}
                  onChange={(e) => setProducto({ ...producto, nombre: e.target.value })}
                  className="bg-dark text-white border-secondary"
                  required
                />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label className="small text-light mb-1">Categoría *</Form.Label>
                <Form.Select
                  value={producto.categoria}
                  onChange={(e) => setProducto({ ...producto, categoria: e.target.value })}
                  className="bg-dark text-white border-secondary"
                >
                  <option value="audio">Audio</option>
                  <option value="computacion">Computación</option>
                  <option value="hogar">Hogar</option>
                </Form.Select>
              </Form.Group>
              <Row>
                <Col>
                  <Form.Group className="mb-2">
                    <Form.Label className="small text-light mb-1">Precio *</Form.Label>
                    <Form.Control
                      type="number"
                      value={producto.precio}
                      onChange={(e) => setProducto({ ...producto, precio: e.target.value })}
                      className="bg-dark text-white border-secondary"
                      required
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group className="mb-2">
                    <Form.Label className="small text-light mb-1">Stock *</Form.Label>
                    <Form.Control
                      type="number"
                      value={producto.stock}
                      onChange={(e) => setProducto({ ...producto, stock: e.target.value })}
                      className="bg-dark text-white border-secondary"
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Form.Group className="mb-2">
                <Form.Label className="small text-light mb-1">Emoji</Form.Label>
                <Form.Control
                  type="text"
                  value={producto.emoji}
                  onChange={(e) => setProducto({ ...producto, emoji: e.target.value })}
                  className="bg-dark text-white border-secondary"
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label className="small text-light mb-1">Descripción *</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={2}
                  value={producto.descripcion}
                  onChange={(e) => setProducto({ ...producto, descripcion: e.target.value })}
                  className="bg-dark text-white border-secondary"
                  required
                />
              </Form.Group>
              <Button variant="success" type="submit" className="btn-neon-green w-100 fw-bold">
                Guardar en MySQL
              </Button>
            </Form>
          </Card>
        </Col>

        <Col lg={8}>
          <Card bg="dark" text="white" className="p-3 border-secondary shadow-sm">
            <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center mb-3 gap-2">
              <h5 className="text-info mb-0 fw-bold">🗂️ Inventario en MySQL</h5>
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
                    <th>Ícono</th>
                    <th>ID</th>
                    <th className="text-start">Producto</th>
                    <th>Categoría</th>
                    <th>Stock</th>
                    <th>Precio</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {productosPaginados.map((prod) => (
                    <tr key={prod.id}>
                      <td className="fs-4">{prod.emoji || '🎮'}</td>
                      <td className="small text-light fw-monospace">{prod.id}</td>
                      <td className="fw-bold text-start text-white">{prod.nombre}</td>
                      <td><Badge bg="secondary">{prod.categoria}</Badge></td>
                      <td>
                        <Badge bg={prod.stock > 0 ? 'info' : 'danger'} text={prod.stock > 0 ? 'dark' : 'white'}>
                          {prod.stock} un.
                        </Badge>
                      </td>
                      <td className="text-success fw-bold">${Number(prod.precio).toLocaleString('es-CL')}</td>
                      <td>
                        <div className="d-flex justify-content-center gap-1">
                          <Button as={Link} to={`/admin/editar/${prod.id}`} variant="outline-info" size="sm">
                            Ruta
                          </Button>
                          <Button variant="outline-warning" size="sm" onClick={() => handleAbrirEditar(prod)}>
                            ✏️
                          </Button>
                          <Button variant="outline-danger" size="sm" onClick={() => handleEliminar(prod.id, prod.nombre)}>
                            🗑️
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
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
            <Modal.Title className="neon-green">Editar Producto (#{productoEditando.id})</Modal.Title>
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
                <Form.Label className="text-light">Categoría</Form.Label>
                <Form.Select
                  value={productoEditando.categoria}
                  onChange={(e) => setProductoEditando({ ...productoEditando, categoria: e.target.value })}
                  className="bg-dark text-white border-secondary"
                >
                  <option value="audio">Audio</option>
                  <option value="computacion">Computación</option>
                  <option value="hogar">Hogar</option>
                </Form.Select>
              </Form.Group>
              <Row>
                <Col>
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
                </Col>
                <Col>
                  <Form.Group className="mb-2">
                    <Form.Label className="text-light">Stock</Form.Label>
                    <Form.Control
                      type="number"
                      value={productoEditando.stock ?? 0}
                      onChange={(e) => setProductoEditando({ ...productoEditando, stock: e.target.value })}
                      className="bg-dark text-white border-secondary"
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Form.Group className="mb-2">
                <Form.Label className="text-light">Emoji</Form.Label>
                <Form.Control
                  type="text"
                  value={productoEditando.emoji || ''}
                  onChange={(e) => setProductoEditando({ ...productoEditando, emoji: e.target.value })}
                  className="bg-dark text-white border-secondary"
                />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label className="text-light">Descripción</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={productoEditando.descripcion || ''}
                  onChange={(e) => setProductoEditando({ ...productoEditando, descripcion: e.target.value })}
                  className="bg-dark text-white border-secondary"
                />
              </Form.Group>
            </Modal.Body>
            <Modal.Footer className="bg-dark border-secondary">
              <Button variant="secondary" onClick={() => setShowEditModal(false)}>Cancelar</Button>
              <Button variant="success" type="submit">Actualizar</Button>
            </Modal.Footer>
          </Form>
        </Modal>
      )}
    </section>
  );
};

// --- Vista Órdenes / Boletas Reales (ROLE_ADMIN y ROLE_VENDEDOR) ---
const OrdenesView = () => {
  const [ordenes, setOrdenes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [ordenSeleccionada, setOrdenSeleccionada] = useState(null);

  useEffect(() => {
    const cargar = async () => {
      try {
        const datos = await listarPedidos();
        setOrdenes(datos);
      } catch (err) {
        setError(mensajeDeError(err));
      } finally {
        setCargando(false);
      }
    };
    cargar();
  }, []);

  return (
    <section className="my-4">
      <h2 className="neon-green fw-bold mb-3">🧾 Órdenes y Boletas (MySQL)</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {cargando ? (
        <div className="text-center py-5"><Spinner animation="border" variant="success" /></div>
      ) : (
        <Card bg="dark" text="white" className="p-3 border-secondary">
          <div className="table-responsive">
            <Table striped bordered hover variant="dark" className="align-middle mb-0">
              <thead>
                <tr>
                  <th>N° Boleta</th>
                  <th>Fecha</th>
                  <th>Unidades</th>
                  <th>Total</th>
                  <th>Detalle</th>
                </tr>
              </thead>
              <tbody>
                {ordenes.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-4 text-light">
                      Aún no hay boletas emitidas en la base de datos.
                    </td>
                  </tr>
                ) : (
                  ordenes.map((ord) => (
                    <tr key={ord.id}>
                      <td className="fw-monospace fw-bold">ORD-{ord.id}</td>
                      <td>{new Date(ord.fecha).toLocaleString('es-CL')}</td>
                      <td>{ord.unidades} un.</td>
                      <td className="text-success fw-bold">${Number(ord.total).toLocaleString('es-CL')}</td>
                      <td>
                        <Button variant="outline-info" size="sm" onClick={() => setOrdenSeleccionada(ord)}>
                          Ver detalle
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          </div>
        </Card>
      )}

      {ordenSeleccionada && (
        <Modal show={Boolean(ordenSeleccionada)} onHide={() => setOrdenSeleccionada(null)} centered>
          <Modal.Header closeButton className="bg-dark text-white border-secondary">
            <Modal.Title className="neon-green">Detalle Boleta ORD-{ordenSeleccionada.id}</Modal.Title>
          </Modal.Header>
          <Modal.Body className="bg-dark text-white">
            <p><strong>Fecha:</strong> {new Date(ordenSeleccionada.fecha).toLocaleString('es-CL')}</p>
            <p><strong>Total Unidades:</strong> {ordenSeleccionada.unidades}</p>
            <hr className="border-secondary" />
            <h6>Productos comprados:</h6>
            <ul className="mb-3">
              {(ordenSeleccionada.detalles || []).map((det) => (
                <li key={det.id}>
                  {det.producto?.nombre || 'Producto'} x{det.cantidad} — ${Number(det.precioUnitario).toLocaleString('es-CL')} c/u
                </li>
              ))}
            </ul>
            <h5 className="text-success fw-bold">Total: ${Number(ordenSeleccionada.total).toLocaleString('es-CL')}</h5>
          </Modal.Body>
          <Modal.Footer className="bg-dark border-secondary">
            <Button variant="secondary" onClick={() => setOrdenSeleccionada(null)}>Cerrar</Button>
          </Modal.Footer>
        </Modal>
      )}
    </section>
  );
};

// --- Vista Catálogo / Productos (con restricciones para ROLE_VENDEDOR) ---
const CatalogoView = ({ productos, onRecargar }) => {
  const { user } = useAuth();
  const rol = getUserRol(user);
  const esVendedor = rol === 'ROLE_VENDEDOR';
  const esAdmin = rol === 'ROLE_ADMIN';

  const handleEliminar = async (id, nombre) => {
    if (window.confirm(`¿Deseas eliminar permanentemente "${nombre}"?`)) {
      try {
        await eliminarProducto(id);
        await onRecargar();
      } catch (err) {
        alert(mensajeDeError(err));
      }
    }
  };

  return (
    <section className="my-4">
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 border-bottom border-secondary pb-2 gap-2">
        <h2 className="neon-green fw-bold mb-0">
          {esVendedor ? '📦 Productos (Solo lectura)' : '🎮 Catálogo Gamer'}
        </h2>
        {esAdmin && (
          <Button as={Link} to="/admin/nuevo" variant="success" className="btn-neon-green fw-bold">
            + Nuevo producto
          </Button>
        )}
      </div>

      <Row className="g-4">
        {productos.map((prod) => (
          <Col key={prod.id} md={4} sm={6}>
            <div className="h-100 d-flex flex-column">
              <ProductCard producto={prod} soloLectura={esVendedor} />
              {esAdmin && (
                <div className="d-flex gap-2 mt-2">
                  <Button as={Link} to={`/admin/editar/${prod.id}`} variant="outline-warning" size="sm" className="w-50">
                    Editar
                  </Button>
                  <Button variant="outline-danger" size="sm" className="w-50" onClick={() => handleEliminar(prod.id, prod.nombre)}>
                    Eliminar
                  </Button>
                </div>
              )}
            </div>
          </Col>
        ))}
      </Row>
    </section>
  );
};

// --- Vista Home ---
const Home = ({ productos }) => {
  const { user } = useAuth();
  const rol = getUserRol(user);
  const esVendedor = rol === 'ROLE_VENDEDOR';
  const [categoriaSel, setCategoriaSel] = useState('TODOS');

  const categorias = [
    { id: 'TODOS', nombre: 'Todo el Setup', icono: '🎮' },
    { id: 'audio', nombre: 'Audio', icono: '🎧' },
    { id: 'computacion', nombre: 'Computación', icono: '🖥️' },
    { id: 'hogar', nombre: 'Hogar', icono: '🪑' }
  ];

  const productosFiltrados = productos.filter((prod) =>
    categoriaSel === 'TODOS' ? true : prod.categoria === categoriaSel
  );

  return (
    <>
      <section className="mb-5">
        <Carousel fade interval={4000} className="rounded shadow-lg overflow-hidden border border-secondary">
          <Carousel.Item style={{ height: '340px', backgroundColor: '#0d0d0d' }}>
            <div className="d-flex h-100 align-items-center justify-content-between p-4 p-md-5">
              <div style={{ maxWidth: '600px' }}>
                <Badge bg="success" className="mb-2 px-3 py-2 fs-6">BENEFICIO DUOC UC ACTIVADO</Badge>
                <h1 className="display-5 fw-bold text-white mb-3">
                  OBTÉN UN <span className="neon-green">20% DE DESCUENTO</span> DE POR VIDA
                </h1>
                <p className="lead text-light mb-4" style={{ color: '#cccccc' }}>
                  Regístrate con tu correo <strong>@duocuc.cl</strong> o <strong>@profesor.duoc.cl</strong>.
                </p>
                {!esVendedor && (
                  <Button variant="success" size="lg" as={Link} to="/registro" className="btn-neon-green fw-bold">
                    Crear Cuenta y Aplicar Dcto →
                  </Button>
                )}
              </div>
              <div className="d-none d-md-block fs-1 text-center pe-5">🎓🎮</div>
            </div>
          </Carousel.Item>
        </Carousel>
      </section>

      <section className="mb-5">
        <div className="d-flex flex-wrap justify-content-between align-items-center mb-3 gap-2">
          <h3 className="neon-green fw-bold mb-0">🔥 Catálogo en Línea</h3>
          <div className="d-flex flex-wrap gap-2">
            {categorias.map((cat) => (
              <Button
                key={cat.id}
                variant={categoriaSel === cat.id ? 'success' : 'outline-secondary'}
                size="sm"
                className={categoriaSel === cat.id ? 'btn-neon-green fw-bold' : 'text-white'}
                onClick={() => setCategoriaSel(cat.id)}
              >
                {cat.icono} {cat.nombre}
              </Button>
            ))}
          </div>
        </div>

        <Row className="g-4">
          {productosFiltrados.map((prod) => (
            <Col key={prod.id} md={4} sm={6}>
              <ProductCard producto={prod} soloLectura={esVendedor} />
            </Col>
          ))}
        </Row>
      </section>

      <ReviewSection />
    </>
  );
};

// --- App Principal ---
function AppContent() {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [errorApi, setErrorApi] = useState('');
  const [showCart, setShowCart] = useState(false);

  const cargarProductosDesdeApi = useCallback(async () => {
    try {
      setErrorApi('');
      const datos = await listarProductos();
      setProductos(datos);
    } catch (err) {
      setErrorApi(mensajeDeError(err));
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    cargarProductosDesdeApi();
  }, [cargarProductosDesdeApi]);

  return (
    <div className="min-vh-100 bg-black text-white d-flex flex-column">
      <HeaderNav onOpenCart={() => setShowCart(true)} />

      <Container className="flex-grow-1 py-3">
        {errorApi && (
          <Alert variant="danger" className="my-3">
            <strong>Error de conexión con la API:</strong> {errorApi}
          </Alert>
        )}

        {cargando ? (
          <div className="text-center py-5">
            <Spinner animation="border" variant="success" />
            <p className="mt-2 text-light">Conectando con Spring Boot + MySQL...</p>
          </div>
        ) : (
          <Routes>
            <Route path="/" element={<Home productos={productos} />} />
            <Route path="/catalogo" element={<CatalogoView productos={productos} onRecargar={cargarProductosDesdeApi} />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/registro" element={<RegistroForm />} />
            <Route path="/contacto" element={<ContactoForm />} />

            {/* Checkout: requiere sesión de CLIENTE o ADMIN (VENDEDOR bloqueado) */}
            <Route
              path="/checkout"
              element={
                <RutaProtegida rolesPermitidos={['ROLE_ADMIN', 'ROLE_CLIENTE']}>
                  <Checkout />
                </RutaProtegida>
              }
            />

            {/* Órdenes: solo ADMIN y VENDEDOR */}
            <Route
              path="/ordenes"
              element={
                <RutaProtegida rolesPermitidos={['ROLE_ADMIN', 'ROLE_VENDEDOR']}>
                  <OrdenesView />
                </RutaProtegida>
              }
            />

            {/* Administración: solo ROLE_ADMIN */}
            <Route
              path="/admin"
              element={
                <RutaProtegida rolesPermitidos={['ROLE_ADMIN']}>
                  <AdminPanel productos={productos} onRecargar={cargarProductosDesdeApi} />
                </RutaProtegida>
              }
            />
            <Route
              path="/admin/nuevo"
              element={
                <RutaProtegida rolesPermitidos={['ROLE_ADMIN']}>
                  <NuevoProductoView onRecargar={cargarProductosDesdeApi} />
                </RutaProtegida>
              }
            />
            <Route
              path="/admin/editar/:id"
              element={
                <RutaProtegida rolesPermitidos={['ROLE_ADMIN']}>
                  <EditarProductoView productos={productos} onRecargar={cargarProductosDesdeApi} />
                </RutaProtegida>
              }
            />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        )}
      </Container>

      <CartModal show={showCart} onHide={() => setShowCart(false)} />
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <AppContent />
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}