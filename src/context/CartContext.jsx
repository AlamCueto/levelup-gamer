import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState([]);

  const rol = user?.rol || user?.role || null;
  const esVendedor = rol === 'ROLE_VENDEDOR';

  // Correlativo de orden incremental (inicia en 123456 y se guarda en localStorage)
  const [siguienteOrden, setSiguienteOrden] = useState(() => {
    const ordenGuardada = localStorage.getItem('siguienteOrden');
    return ordenGuardada ? parseInt(ordenGuardada, 10) : 123456;
  });

  useEffect(() => {
    localStorage.setItem('siguienteOrden', siguienteOrden.toString());
  }, [siguienteOrden]);

  // Si entra un VENDEDOR, limpiamos cualquier resto en el carrito
  useEffect(() => {
    if (esVendedor) {
      setCart([]);
    }
  }, [esVendedor]);

  // --- FUNCIONES DEL CARRITO ---

  const addToCart = (product) => {
    if (!product || esVendedor) {
      return;
    }

    const existing = cart.find((item) => item.id === product.id);
    const cantidadActual = existing ? existing.cantidad : 0;

    if (typeof product.stock === 'number' && cantidadActual + 1 > product.stock) {
      alert('Error: stock no disponible');
      return;
    }

    setCart((prevCart) => {
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
  const subtotal = esVendedor
    ? 0
    : cart.reduce((acc, item) => acc + Number(item.precio || 0) * Number(item.cantidad || 1), 0);

  const totalItems = esVendedor
    ? 0
    : cart.reduce((acc, item) => acc + Number(item.cantidad || 1), 0);

  const correoLower = user?.email ? user.email.toLowerCase() : '';
  const esAlumnoDuocValido = Boolean(
    user &&
    !esVendedor &&
    (correoLower.endsWith('@duocuc.cl') || correoLower.endsWith('@profesor.duoc.cl'))
  );

  const descuentoDuoc = esAlumnoDuocValido ? Math.round(subtotal * 0.2) : 0;
  const total = subtotal - descuentoDuoc;

  const obtenerNuevoNumeroOrden = () => {
    const numeroActual = siguienteOrden;
    setSiguienteOrden((prev) => prev + 1);
    return `#${numeroActual}`;
  };

  return (
    <CartContext.Provider
      value={{
        cart: esVendedor ? [] : cart,
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