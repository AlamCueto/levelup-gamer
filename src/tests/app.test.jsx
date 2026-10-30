import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { CartProvider, useCart } from '../context/CartContext';
import { AuthProvider } from '../context/AuthContext';
import { ProductCard } from '../components/ProductCard';
import { ReviewSection } from '../components/ReviewSection';
import { RegistroForm } from '../components/RegistroForm';

// Imagen de prueba para evitar warnings de 'src' vacío
const MOCK_IMAGE = 'https://via.placeholder.com/150';

// Componente auxiliar para probar las funciones del CartContext
const TestCartComponent = () => {
  const { cart, addToCart, removeFromCart, clearCart, subtotal, descuentoDuoc, total } = useCart();
  return (
    <div>
      <span data-testid="cart-count">{cart.length}</span>
      <span data-testid="subtotal">{subtotal}</span>
      <span data-testid="descuento">{descuentoDuoc}</span>
      <span data-testid="total">{total}</span>
      <button data-testid="add-btn" onClick={() => addToCart({ id: '1', nombre: 'PS5', precio: 100000 })}>Add</button>
      <button data-testid="remove-btn" onClick={() => removeFromCart('1')}>Remove</button>
      <button data-testid="clear-btn" onClick={clearCart}>Clear</button>
    </div>
  );
};

describe('Batería de Pruebas Unitarias Frontend - Level-Up Gamer', () => {

  // PRUEBA 1: Verificación de renderizado básico de componente
  it('1. Debe renderizar correctamente el nombre del producto en ProductCard', () => {
    render(<ProductCard id="1" nombre="PlayStation 5" precio={549990} descripcion="Test" imagen={MOCK_IMAGE} onAddToCart={() => {}} />);
    expect(screen.getByText('PlayStation 5')).toBeTruthy();
  });

  // PRUEBA 2: Interacción de evento y llamada a función por Props
  it('2. Debe invocar a la función onAddToCart al hacer clic en el botón Añadir al Carrito', () => {
    const spy = vi.fn();
    render(<ProductCard id="1" nombre="PS5" precio={500000} descripcion="Test" imagen={MOCK_IMAGE} onAddToCart={spy} />);
    fireEvent.click(screen.getByText('Añadir al Carrito'));
    expect(spy).toHaveBeenCalledWith({ id: '1', nombre: 'PS5', precio: 500000 });
  });

  // PRUEBA 3: Modificación del Estado Global (Carrito)
  it('3. Debe incrementar la cantidad de ítems del carrito al agregar un producto', () => {
    render(<AuthProvider><CartProvider><TestCartComponent /></CartProvider></AuthProvider>);
    fireEvent.click(screen.getByTestId('add-btn'));
    expect(screen.getByTestId('cart-count').textContent).toBe('1');
  });

  // PRUEBA 4: Regla de Negocio - Cálculo de Descuento Duoc (20%)
  it('4. Debe calcular exactamente el 20% de descuento Duoc UC sobre el subtotal', () => {
    // El descuento exige un usuario autenticado con correo @duocuc.cl
    localStorage.setItem('user', JSON.stringify({ email: 'alan@duocuc.cl', nombre: 'Alan' }));
    render(<AuthProvider><CartProvider><TestCartComponent /></CartProvider></AuthProvider>);
    fireEvent.click(screen.getByTestId('add-btn')); // Precio: 100.000
    expect(screen.getByTestId('subtotal').textContent).toBe('100000');
    expect(screen.getByTestId('descuento').textContent).toBe('20000'); // 20%
    expect(screen.getByTestId('total').textContent).toBe('80000');
  });

  // PRUEBA 5: Eliminación de ítems del estado
  it('5. Debe eliminar un producto específico del carrito', () => {
    render(<AuthProvider><CartProvider><TestCartComponent /></CartProvider></AuthProvider>);
    fireEvent.click(screen.getByTestId('add-btn'));
    fireEvent.click(screen.getByTestId('remove-btn'));
    expect(screen.getByTestId('cart-count').textContent).toBe('0');
  });

  // PRUEBA 6: Limpieza total de estado
  it('6. Debe restablecer el carrito a cero al accionar la función vaciar', () => {
    render(<AuthProvider><CartProvider><TestCartComponent /></CartProvider></AuthProvider>);
    fireEvent.click(screen.getByTestId('add-btn'));
    fireEvent.click(screen.getByTestId('clear-btn'));
    expect(screen.getByTestId('cart-count').textContent).toBe('0');
  });

  // PRUEBA 7: Manipulación del DOM y publicación de opiniones
  it('7. Debe publicar una nueva reseña en el componente ReviewSection', () => {
    render(<ReviewSection />);
    const textarea = screen.getByPlaceholderText(/Escribe tu opinión/i);
    const btn = screen.getByText('Publicar Reseña');
    
    fireEvent.change(textarea, { target: { value: 'Excelente servicio gamer' } });
    fireEvent.click(btn);

    expect(screen.getByText('Excelente servicio gamer')).toBeTruthy();
  });

  // PRUEBA 8: Validación de Formularios (Contraseñas no coincidentes)
  it('8. Debe mostrar un mensaje de error si las contraseñas no coinciden en Registro', () => {
    render(
      <MemoryRouter>
        <AuthProvider>
          <RegistroForm />
        </AuthProvider>
      </MemoryRouter>
    );
    fireEvent.change(screen.getByLabelText(/Nombre Completo/i), { target: { value: 'Alan' } });
    fireEvent.change(screen.getByLabelText(/Correo Electrónico/i), { target: { value: 'alan@duocuc.cl' } });
    fireEvent.change(screen.getByLabelText(/^Contraseña/i), { target: { value: '123456' } });
    fireEvent.change(screen.getByLabelText(/Confirmar Contraseña/i), { target: { value: '654321' } });

    fireEvent.click(screen.getByRole('button', { name: /Registrarse/i }));
    expect(screen.getByText(/Las contraseñas no coinciden/i)).toBeTruthy();
  });

  // PRUEBA 9: Validación de dominio institucional Duoc
  it('9. Debe reconocer un correo @duocuc.cl y otorgar el beneficio del 20% Off', () => {
    render(
      <MemoryRouter>
        <AuthProvider>
          <RegistroForm />
        </AuthProvider>
      </MemoryRouter>
    );
    fireEvent.change(screen.getByLabelText(/Nombre Completo/i), { target: { value: 'Alan' } });
    fireEvent.change(screen.getByLabelText(/Correo Electrónico/i), { target: { value: 'alan@duocuc.cl' } });
    fireEvent.change(screen.getByLabelText(/^Contraseña/i), { target: { value: '123456' } });
    fireEvent.change(screen.getByLabelText(/Confirmar Contraseña/i), { target: { value: '123456' } });

    expect(screen.getByText(/¡Correo Duoc UC Detectado!/i)).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: /Registrarse/i }));
  });
    

  // PRUEBA 10: Renderizado condicional de Badges/Tags
  it('10. Debe mostrar la etiqueta BENEFICIO DUOC si el producto cuenta con la propiedad tag', () => {
    render(<ProductCard id="1" nombre="PC ROG" precio={100} tag="BENEFICIO DUOC" tagClase="bg-success" imagen={MOCK_IMAGE} onAddToCart={() => {}} />);
    expect(screen.getByText('BENEFICIO DUOC')).toBeTruthy();
  });

});