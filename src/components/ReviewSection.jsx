import React, { useState } from 'react';

export const ReviewSection = () => {
  const [resenas, setResenas] = useState([
    { id: 1, usuario: 'GamerDuoc', puntuacion: 5, comentario: '¡Excelente servicio y envío rápido!' }
  ]);
  const [puntuacion, setPuntuacion] = useState('5');
  const [comentario, setComentario] = useState('');
  const [mensajeExito, setMensajeExito] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!comentario.trim()) return;

    const nuevaResena = {
      id: Date.now(),
      usuario: 'Estudiante Gamer',
      puntuacion: parseInt(puntuacion),
      comentario
    };

    setResenas([...resenas, nuevaResena]);
    setComentario('');
    setMensajeExito(true);

    setTimeout(() => setMensajeExito(false), 3000);
  };

  return (
    <section className="resenas-container bg-dark text-white p-4 rounded border border-secondary my-4">
      <h3 className="text-success border-bottom border-success pb-2 mb-3">
        ⭐ Reseñas y Calificaciones de Clientes
      </h3>

      <div className="lista-resenas mb-4">
        {resenas.map((resena) => (
          <div key={resena.id} className="p-2 mb-2 bg-secondary rounded text-light">
            <strong>{resena.usuario}</strong> - {'⭐'.repeat(resena.puntuacion)}
            <p className="mb-0 small">{resena.comentario}</p>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="p-3 bg-secondary rounded">
        <h4 className="h6 text-white mb-3">Dejar una Calificación</h4>
        
        <div className="mb-3">
          <label className="form-label small">Tu Valoración:</label>
          <select 
            className="form-select bg-dark text-white border-dark"
            value={puntuacion} 
            onChange={(e) => setPuntuacion(e.target.value)}
          >
            <option value="5">⭐⭐⭐⭐⭐ (5/5) - ¡Excelente!</option>
            <option value="4">⭐⭐⭐⭐☆ (4/5) - Muy Bueno</option>
            <option value="3">⭐⭐⭐☆☆ (3/5) - Aceptable</option>
            <option value="2">⭐⭐☆☆☆ (2/5) - Regular</option>
            <option value="1">⭐☆☆☆☆ (1/5) - Malo</option>
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label small">Tu Comentario:</label>
          <textarea 
            className="form-control bg-dark text-white border-dark"
            rows="3" 
            placeholder="Escribe tu opinión sobre el producto..." 
            value={comentario}
            onChange={(e) => setComentario(e.target.value)}
            required 
          />
        </div>

        <button type="submit" className="btn btn-success fw-bold">Publicar Reseña</button>
        {mensajeExito && <div className="text-success mt-2 small">¡Reseña publicada con éxito!</div>}
      </form>
    </section>
  );
};