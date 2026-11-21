import React from 'react';
import { Badge } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const FOTOS_POR_PRODUCTO = {
  'Audífonos inalámbricos Onda': 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=600&q=80',
  'Parlante portátil Roca': 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=600&q=80',
  'Teclado mecánico Cordillera': 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?auto=format&fit=crop&w=600&q=80',
  'Mouse ergonómico Pehuén': 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=600&q=80',
  'Monitor 27" Atacama': 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=600&q=80',
  'Lámpara de escritorio Aurora': 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=600&q=80',
  'Silla de escritorio Valle': 'https://images.unsplash.com/photo-1598550476439-6847785fcea6?auto=format&fit=crop&w=600&q=80',
  'Cámara web Mirador HD': 'https://images.unsplash.com/photo-1616588589676-62b3bd4ff6d2?auto=format&fit=crop&w=600&q=80',
};

const FOTOS_POR_CATEGORIA = {
  audio: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=600&q=80',
  computacion: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=600&q=80',
  hogar: 'https://images.unsplash.com/photo-1598550476439-6847785fcea6?auto=format&fit=crop&w=600&q=80',
};

export const ProductCard = ({
  producto,
  id,
  nombre,
  precio,
  imagen,
  tag,
  tagClase,
  descripcion,
  onAddToCart,
  soloLectura = false,
}) => {
  const { user } = useAuth();
  const { addToCart } = useCart();

  const item = producto || { id, nombre, precio, imagen, tag, tagClase, descripcion };
  const rol = user?.rol || user?.role || null;
  const ocultarCompra = soloLectura || rol === 'ROLE_VENDEDOR';
  const sinStock = typeof item.stock === 'number' && item.stock <= 0;

  const fotoFinal =
    item.imagen ||
    FOTOS_POR_PRODUCTO[item.nombre] ||
    FOTOS_POR_CATEGORIA[item.categoria] ||
    'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=600&q=80';

  const handleAgregar = () => {
    if (sinStock) return;
    if (onAddToCart) {
      onAddToCart(item);
    } else if (addToCart) {
      addToCart(item);
    }
  };

  return (
    <article className="card-producto card h-100 bg-dark text-white border-secondary position-relative overflow-hidden">
      {(item.tag || item.categoria) && (
        <div className="position-absolute top-0 end-0 m-2 d-flex gap-1">
          {item.tag && <Badge bg="success">{item.tag}</Badge>}
          {item.categoria && <Badge bg="secondary" className="text-uppercase">{item.categoria}</Badge>}
        </div>
      )}

      <img
        src={fotoFinal}
        alt={item.nombre}
        className="card-img-top producto-img"
        style={{ height: '200px', objectFit: 'cover' }}
      />

      <div className="card-body d-flex flex-column justify-content-between">
        <div>
          <h3 className="h5 text-light">
            {item.emoji ? `${item.emoji} ` : ''}{item.nombre}
          </h3>
          <p className="descripcion-corta text-light small" style={{ color: '#bbbbbb' }}>
            {item.descripcion}
          </p>
        </div>

        <div>
          <div className="d-flex justify-content-between align-items-center mb-2">
            <span className="precio fs-5 fw-bold text-success">
              ${Number(item.precio || 0).toLocaleString('es-CL')} CLP
            </span>
            {typeof item.stock === 'number' && (
              <Badge bg={sinStock ? 'danger' : 'info'} text={sinStock ? 'white' : 'dark'}>
                {sinStock ? 'Agotado' : `Stock: ${item.stock}`}
              </Badge>
            )}
          </div>

          {!ocultarCompra && (
            <button
              type="button"
              disabled={sinStock}
              className={`btn ${sinStock ? 'btn-outline-secondary' : 'btn-outline-success'} w-100 fw-bold`}
              onClick={handleAgregar}
            >
              {sinStock ? 'Sin Stock' : 'Añadir al Carrito'}
            </button>
          )}
        </div>
      </div>
    </article>
  );
};