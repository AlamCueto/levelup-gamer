import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function AdminPanel() {
  const { user } = useAuth();
  const [nuevoProducto, setNuevoProducto] = useState({
    nombre: '',
    precio: '',
    categoria: '',
    imagen: ''
  });

  if (!user || user.role !== 'admin') {
    return <h2 style={{ color: 'red', textAlign: 'center' }}>Acceso denegado. Se requiere cuenta de administrador.</h2>;
  }

  const handleGuardarProducto = (e) => {
    e.preventDefault();
    console.log('Producto agregado:', nuevoProducto);
    alert('Producto publicado con éxito en el catálogo');
    setNuevoProducto({ nombre: '', precio: '', categoria: '', imagen: '' });
  };

  return (
    <div style={{ padding: '2rem', color: '#fff' }}>
      <h1>Panel de Administración - LEVEL-UP GAMER</h1>
      <h3>Agregar Nuevo Producto al Catálogo</h3>
      
      <form onSubmit={handleGuardarProducto} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '500px' }}>
        <input 
          type="text" 
          placeholder="Nombre del Producto" 
          value={nuevoProducto.nombre} 
          onChange={(e) => setNuevoProducto({...nuevoProducto, nombre: e.target.value})} 
          required 
        />
        <input 
          type="number" 
          placeholder="Precio" 
          value={nuevoProducto.precio} 
          onChange={(e) => setNuevoProducto({...nuevoProducto, precio: e.target.value})} 
          required 
        />
        <input 
          type="text" 
          placeholder="Categoría (ej: Teclados, Consolas)" 
          value={nuevoProducto.categoria} 
          onChange={(e) => setNuevoProducto({...nuevoProducto, categoria: e.target.value})} 
          required 
        />
        <input 
          type="text" 
          placeholder="URL de la Imagen" 
          value={nuevoProducto.imagen} 
          onChange={(e) => setNuevoProducto({...nuevoProducto, imagen: e.target.value})} 
          required 
        />
        <button type="submit" style={{ backgroundColor: '#00ff66', color: '#000', fontWeight: 'bold', padding: '10px' }}>
          Publicar Producto
        </button>
      </form>
    </div>
  );
}