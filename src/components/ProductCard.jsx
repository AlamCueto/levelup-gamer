import React from 'react';

export const ProductCard = ({ id, nombre, precio, imagen, tag, tagClase, descripcion, onAddToCart }) => {
  return (
    <article className="card-producto card h-100 bg-dark text-white border-secondary">
      {tag && <div className={`card-tag ${tagClase || ''}`}>{tag}</div>}
      <img src={imagen} alt={nombre} className="card-img-top producto-img" style={{ height: '200px', objectFit: 'cover' }} />
      <div className="card-body d-flex flex-column justify-content-between">
        <div>
          <h3 className="h5 text-light">{nombre}</h3>
          <p className="descripcion-corta text-muted small">{descripcion}</p>
        </div>
        <div>
          <span className="precio d-block fs-5 fw-bold text-success mb-2">
            ${precio.toLocaleString('es-CL')} CLP
          </span>
          <button 
            className="btn btn-outline-success w-100 fw-bold"
            onClick={() => onAddToCart({ id, nombre, precio })}
          >
            Añadir al Carrito
          </button>
        </div>
      </div>
    </article>
  );
};