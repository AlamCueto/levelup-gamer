import { createContext, useState, useContext, useEffect } from 'react';
import api from '../servicios/api';

const AuthContext = createContext();

// Verifica si el JWT guardado sigue vigente (decodificando el payload Base64)
const tokenEsValido = (token) => {
  if (!token) return false;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    if (payload.exp && payload.exp * 1000 < Date.now()) {
      return false; // Token expirado
    }
    return true;
  } catch {
    return false;
  }
};

export const AuthProvider = ({ children }) => {
  // Restaura la sesión al recargar (F5) solo si existe un JWT válido
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    if (token && savedUser && tokenEsValido(token)) {
      return JSON.parse(savedUser);
    }
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return null;
  });

  const [registeredUsers, setRegisteredUsers] = useState(() => {
    const savedUsers = localStorage.getItem('registeredUsers');
    return savedUsers ? JSON.parse(savedUsers) : [];
  });

  useEffect(() => {
    localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
  }, [registeredUsers]);

  const register = (newUser) => {
    const existe = registeredUsers.some(
      (u) => u.email.toLowerCase() === newUser.email.toLowerCase()
    );
    if (existe) {
      return { success: false, message: 'Este correo electrónico ya está registrado.' };
    }

    const emailLower = (newUser.email || '').toLowerCase();
    const esDuoc =
      emailLower.endsWith('@duocuc.cl') || emailLower.endsWith('@profesor.duoc.cl');

    const usuarioConRol = {
      ...newUser,
      rol: newUser.rol || 'ROLE_CLIENTE',
      role: newUser.role || 'ROLE_CLIENTE',
      esDuoc,
    };

    setRegisteredUsers([...registeredUsers, usuarioConRol]);
    setUser(usuarioConRol);
    localStorage.setItem('user', JSON.stringify(usuarioConRol));

    return { success: true };
  };

  // Inicia sesión contra POST /api/v1/auth/login
  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', {
        email: email.trim(),
        password,
      });

      const { token, email: correoUsuario, nombre, rol } = response.data || {};
      if (!token) {
        return null;
      }

      const emailLower = (correoUsuario || email || '').toLowerCase();
      const esDuoc =
        emailLower.endsWith('@duocuc.cl') || emailLower.endsWith('@profesor.duoc.cl');

      const usuarioAutenticado = {
        email: correoUsuario || email.trim(),
        nombre: nombre || correoUsuario || email.trim(),
        rol,
        role: rol,
        esDuoc,
      };

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(usuarioAutenticado));
      setUser(usuarioAutenticado);

      return usuarioAutenticado;
    } catch {
      return null;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);