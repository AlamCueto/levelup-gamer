import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useAuth(); // Importamos el usuario autenticado desde AuthContext
  const [cart, setCart] = useState([]);

  // Correlativo de orden incremental (inicia en 123456 y se guarda en localStorage)
  const [siguienteOrden, setSiguienteOrden] = useState(() => {
    const ordenGuardada = localStorage.getItem('siguienteOrden');
    return ordenGuardada ? parseInt(ordenGuardada, 10) : 123456;
  });

  // Persistir el número de orden en el navegador
  useEffect(() => {
    localStorage.setItem('siguienteOrden', siguienteOrden.toString());
  }, [siguienteOrden]);

  // --- FUNCIONES DEL CARRITO ---
  const addToCart = (product) => {
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.id === product.id);
      if (existing) {
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, cantidad: item.cantidad + 1 } : item
        );
      }
      return [...prevCart, { ...product, cantidad: 1 }];
    });
  };

  const removeFromCart = (id) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  const clearCart = () => setCart([]);

  // --- CÁLCULOS MATEMÁTICOS Y REGLA DUOC ---
  const subtotal = cart.reduce((acc, item) => acc + item.precio * item.cantidad, 0);
  const totalItems = cart.reduce((acc, item) => acc + item.cantidad, 0);

  // VALIDACIÓN DE ALUMNO DUOC:
  // Requiere usuario logueado Y que su correo termine explícitamente en "@duocuc.cl"
  const esAlumnoDuocValido = Boolean(
    user && 
    user.email && 
    user.email.toLowerCase().endsWith('@duocuc.cl')
  );

  // El 20% de descuento solo se calcula si es un alumno válido
  const descuentoDuoc = esAlumnoDuocValido ? Math.round(subtotal * 0.2) : 0;
  const total = subtotal - descuentoDuoc;

  // Función para obtener el número de boleta/voucher e incrementar el contador
  const obtenerNuevoNumeroOrden = () => {
    const numeroActual = siguienteOrden;
    setSiguienteOrden((prev) => prev + 1);
    return `#${numeroActual}`;
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        clearCart,
        subtotal,
        descuentoDuoc,
        total,
        totalItems,
        esAlumnoDuocValido,
        obtenerNuevoNumeroOrden,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);