import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Login() {
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

    try {
      const resultado = await login(email, password);

      if (!resultado) {
        setError('Credenciales incorrectas');
        return;
      }

      // Soporta tanto que login() retorne el objeto usuario/respuesta como { ok: true, rol } o true
      const rol =
        typeof resultado === 'object'
          ? resultado.rol || resultado.user?.rol || resultado.role
          : null;

      if (rol === 'ROLE_ADMIN') {
        navigate('/admin', { replace: true });
      } else if (rol === 'ROLE_VENDEDOR') {
        navigate('/ordenes', { replace: true });
      } else {
        navigate('/', { replace: true });
      }
    } catch (err) {
      setError('Error al iniciar sesión. Intenta nuevamente.');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div style={{ padding: '2rem', color: '#fff', maxWidth: '400px', margin: 'auto' }}>
      <h2>Iniciar Sesión</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <input
          type="email"
          placeholder="Correo Electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" disabled={cargando}>
          {cargando ? 'Ingresando...' : 'Ingresar'}
        </button>
      </form>
    </div>
  );
}