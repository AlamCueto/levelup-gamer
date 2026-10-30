import { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Usuario actualmente logueado
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // Lista de usuarios registrados (inicia con el Admin por defecto)
  const [registeredUsers, setRegisteredUsers] = useState(() => {
    const savedUsers = localStorage.getItem('registeredUsers');
    return savedUsers
      ? JSON.parse(savedUsers)
      : [
          {
            nombre: 'Administrador',
            email: 'admin@levelup.cl',
            password: 'admin123',
            role: 'admin',
            esDuoc: false
          }
        ];
  });

  // Guardar en localStorage cuando cambie la lista de usuarios registrados
  useEffect(() => {
    localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
  }, [registeredUsers]);

  // Función para REGISTRAR un nuevo usuario
  const register = (newUser) => {
    // Verificar si el correo ya existe
    const existe = registeredUsers.some((u) => u.email.toLowerCase() === newUser.email.toLowerCase());
    if (existe) {
      return { success: false, message: 'Este correo electrónico ya está registrado.' };
    }

    const usuarioConRol = {
      ...newUser,
      role: newUser.role || 'user'
    };

    const nuevaLista = [...registeredUsers, usuarioConRol];
    setRegisteredUsers(nuevaLista);

    // Auto-login al registrarse
    setUser(usuarioConRol);
    localStorage.setItem('user', JSON.stringify(usuarioConRol));

    return { success: true };
  };

  // Función para INICIAR SESIÓN
  const login = (email, password) => {
    const usuarioEncontrado = registeredUsers.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );

    if (usuarioEncontrado) {
      setUser(usuarioEncontrado);
      localStorage.setItem('user', JSON.stringify(usuarioEncontrado));
      return true;
    }

    return false;
  };

  // Función para CERRAR SESIÓN
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);