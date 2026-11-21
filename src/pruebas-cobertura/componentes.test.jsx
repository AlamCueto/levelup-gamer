import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import { RegistroForm } from '../components/RegistroForm';
import { ReviewSection } from '../components/ReviewSection';
import { ProductCard } from '../components/ProductCard';
import { Catalogo, productosGamer } from '../pages/Catalogo';
import { ContactoForm as ContactoLegacy } from '../pages/Contacto';
import { RegistroForm as RegistroLegacy } from '../pages/Registro';
import Login from '../pages/Login';
import AdminPanelLegacy from '../pages/AdminPanel';

const escribir = (el, value) => fireEvent.change(el, { target: { value } });
const conProveedores = (ui, ruta = '/') =>
  render(
    <MemoryRouter initialEntries={[ruta]}>
      <AuthProvider>
        <Routes>
          <Route path="/" element={ui} />
          <Route path="/login" element={<p>Pantalla login</p>} />
          <Route path="/admin" element={<p>Pantalla admin</p>} />
        </Routes>
      </AuthProvider>
    </MemoryRouter>
  );

beforeEach(() => vi.spyOn(window, 'alert').mockImplementation(() => {}));
afterEach(() => { vi.restoreAllMocks(); vi.useRealTimers(); });

describe('RegistroForm (componente principal)', () => {
  const llenar = ({ nombre = 'Ana', email = 'ana@mail.com', pass = 'abcdef', conf = 'abcdef' } = {}) => {
    escribir(screen.getByLabelText(/Nombre Completo/), nombre);
    escribir(screen.getByLabelText(/Correo Electrónico/), email);
    escribir(screen.getByLabelText(/^Contraseña/), pass);
    escribir(screen.getByLabelText(/Confirmar Contraseña/), conf);
  };
  const enviar = () => fireEvent.submit(screen.getByRole('button', { name: /Registrar/ }).closest('form'));

  it('Exige todos los campos', () => {
    conProveedores(<RegistroForm />);
    enviar();
    expect(screen.getByText(/completa todos los campos/)).toBeTruthy();
  });

  it('Exige una contraseña de al menos 6 caracteres', () => {
    conProveedores(<RegistroForm />);
    llenar({ pass: '123', conf: '123' });
    enviar();
    expect(screen.getByText(/al menos 6 caracteres/)).toBeTruthy();
  });

  it('Exige aceptar los términos', () => {
    conProveedores(<RegistroForm />);
    llenar();
    enviar();
    expect(screen.getByText(/aceptar los términos/)).toBeTruthy();
  });

  it('Rechaza un correo ya registrado y permite cerrar el aviso', () => {
    conProveedores(<RegistroForm />);
    llenar({ email: 'admin@levelup.cl' });
    fireEvent.click(screen.getByLabelText(/Acepto los términos/));
    enviar();
    expect(screen.getByText(/ya está registrado/)).toBeTruthy();
    fireEvent.click(screen.getByLabelText('Close alert'));
    expect(screen.queryByText(/ya está registrado/)).toBeNull();
  });

  it('Reconoce los dominios @duoc.cl, @duocuc.cl y @profesor.duoc.cl, pero no otros', () => {
    conProveedores(<RegistroForm />);
    const correo = screen.getByLabelText(/Correo Electrónico/);
    ['a@duoc.cl', 'a@duocuc.cl', 'a@profesor.duoc.cl'].forEach((c) => {
      escribir(correo, c);
      expect(screen.getByText(/Correo Duoc UC Detectado/)).toBeTruthy();
    });
    escribir(correo, 'a@gmail.com');
    expect(screen.queryByText(/Correo Duoc UC Detectado/)).toBeNull();
  });

  it('Registra y redirige; el enlace "Inicia sesión" lleva al login', () => {
    conProveedores(<RegistroForm />);
    llenar();
    fireEvent.click(screen.getByLabelText(/Acepto los términos/));
    enviar();
    expect(window.alert).toHaveBeenCalled();
    expect(JSON.parse(localStorage.getItem('user')).email).toBe('ana@mail.com');
  });

  it('El enlace de inicio de sesión navega al login', () => {
    conProveedores(<RegistroForm />);
    fireEvent.click(screen.getByText(/Inicia sesión aquí/));
    expect(screen.getByText('Pantalla login')).toBeTruthy();
  });
});

describe('ReviewSection y ProductCard', () => {
  it('No publica reseñas con comentario vacío o solo espacios', () => {
    render(<ReviewSection />);
    const area = screen.getByPlaceholderText(/Escribe tu opinión/);
    escribir(area, '   ');
    fireEvent.submit(area.closest('form'));
    expect(screen.queryByText(/Reseña publicada/)).toBeNull();
    expect(screen.queryAllByText('Estudiante Gamer', { exact: false }).length).toBe(0);
  });

  it('Publica con la puntuación elegida y oculta el aviso tras 3 s', () => {
    vi.useFakeTimers();
    render(<ReviewSection />);
    fireEvent.change(screen.getByRole('combobox'), { target: { value: '3' } });
    escribir(screen.getByPlaceholderText(/Escribe tu opinión/), 'Aceptable');
    fireEvent.click(screen.getByText('Publicar Reseña'));
    expect(screen.getByText('¡Reseña publicada con éxito!')).toBeTruthy();
    expect(screen.getByText('Aceptable')).toBeTruthy();
    act(() => { vi.advanceTimersByTime(3100); });
    expect(screen.queryByText('¡Reseña publicada con éxito!')).toBeNull();
  });

  it('ProductCard formatea el precio en CLP y no muestra etiqueta sin tag', () => {
    render(<ProductCard id="9" nombre="Cable" precio={1500} imagen="x.png" descripcion="d" onAddToCart={() => {}} />);
    expect(screen.getByText('$1.500 CLP')).toBeTruthy();
    expect(document.querySelector('.card-tag')).toBeNull();
  });

  it('ProductCard usa tag sin clase adicional', () => {
    render(<ProductCard id="9" nombre="Cable" precio={1500} imagen="x.png" tag="NUEVO" onAddToCart={() => {}} />);
    expect(document.querySelector('.card-tag').className.trim()).toBe('card-tag');
  });
});

describe('Páginas heredadas (src/pages)', () => {
  it('Catalogo muestra los 6 productos de la lista', () => {
    render(<Catalogo />);
    expect(productosGamer.length).toBe(6);
    expect(screen.getByText('CATÁLOGO DE EQUIPAMIENTO')).toBeTruthy();
    expect(screen.getByText('Silla Gamer Ergonómica Pro')).toBeTruthy();
  });

  it('Contacto envía solo con los campos completos y limpia el formulario', () => {
    vi.useFakeTimers();
    render(<ContactoLegacy />);
    escribir(screen.getByLabelText('Nombre'), 'Ana');
    escribir(screen.getByLabelText('Correo de Contacto'), 'ana@mail.com');
    fireEvent.change(screen.getByLabelText('Asunto'), { target: { value: 'Garantías' } });
    // sin mensaje: no se envía
    fireEvent.submit(screen.getByText('Enviar Consulta').closest('form'));
    expect(screen.queryByText(/Gracias por contactarnos/)).toBeNull();
    escribir(screen.getByLabelText('Mensaje'), 'Hola');
    fireEvent.submit(screen.getByText('Enviar Consulta').closest('form'));
    expect(screen.getByText(/Gracias por contactarnos/)).toBeTruthy();
    expect(screen.getByLabelText('Nombre').value).toBe('');
    act(() => { vi.advanceTimersByTime(4100); });
    expect(screen.queryByText(/Gracias por contactarnos/)).toBeNull();
  });

  describe('Registro heredado', () => {
    const enviar = () => fireEvent.submit(screen.getByText(/Registrarse y Obtener/).closest('form'));
    const llenar = (email, p1 = 'abc', p2 = 'abc') => {
      escribir(screen.getByLabelText('Nombre Completo'), 'Ana');
      escribir(screen.getByLabelText(/Correo Electrónico/), email);
      escribir(screen.getByLabelText('Contraseña'), p1);
      escribir(screen.getByLabelText('Confirmar Contraseña'), p2);
    };
    it('Exige campos obligatorios', () => {
      render(<RegistroLegacy />);
      enviar();
      expect(screen.getByText(/completa todos los campos/)).toBeTruthy();
    });
    it('Detecta contraseñas distintas', () => {
      render(<RegistroLegacy />);
      llenar('a@duocuc.cl', 'abc', 'xyz');
      enviar();
      expect(screen.getByText(/no coinciden/)).toBeTruthy();
    });
    it('Informa el beneficio para correo Duoc y la nota para otros correos', () => {
      render(<RegistroLegacy />);
      llenar('a@duocuc.cl');
      enviar();
      expect(screen.getByText(/20% de descuento permanente/)).toBeTruthy();
      llenar('a@gmail.com');
      enviar();
      expect(screen.getByText(/Solo correos @duocuc.cl/)).toBeTruthy();
    });
  });

  describe('Login heredado', () => {
    it('Muestra error con credenciales incorrectas', () => {
      conProveedores(<Login />);
      escribir(screen.getByPlaceholderText('Correo Electrónico'), 'x@x.cl');
      escribir(screen.getByPlaceholderText('Contraseña'), 'mala');
      fireEvent.click(screen.getByText('Ingresar'));
      expect(screen.getByText('Credenciales incorrectas')).toBeTruthy();
    });
    it('Redirige al panel con credenciales de administrador', () => {
      conProveedores(<Login />);
      escribir(screen.getByPlaceholderText('Correo Electrónico'), 'admin@levelup.cl');
      escribir(screen.getByPlaceholderText('Contraseña'), 'admin123');
      fireEvent.click(screen.getByText('Ingresar'));
      expect(screen.getByText('Pantalla admin')).toBeTruthy();
    });
  });

  describe('AdminPanel heredado', () => {
    it('Deniega el acceso sin sesión de administrador', () => {
      conProveedores(<AdminPanelLegacy />);
      expect(screen.getByText(/Acceso denegado/)).toBeTruthy();
    });
    it('Permite publicar un producto al administrador', () => {
      localStorage.setItem('user', JSON.stringify({ email: 'admin@levelup.cl', role: 'admin' }));
      const log = vi.spyOn(console, 'log').mockImplementation(() => {});
      conProveedores(<AdminPanelLegacy />);
      escribir(screen.getByPlaceholderText('Nombre del Producto'), 'Teclado');
      escribir(screen.getByPlaceholderText('Precio'), '1000');
      escribir(screen.getByPlaceholderText(/Categoría/), 'Teclados');
      escribir(screen.getByPlaceholderText('URL de la Imagen'), 'http://x/y.png');
      fireEvent.click(screen.getByText('Publicar Producto'));
      expect(window.alert).toHaveBeenCalledWith('Producto publicado con éxito en el catálogo');
      expect(log).toHaveBeenCalled();
      expect(screen.getByPlaceholderText('Nombre del Producto').value).toBe('');
    });
  });
});
