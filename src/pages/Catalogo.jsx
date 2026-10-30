import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { ProductCard } from '../components/ProductCard';

export const productosGamer = [
  {
    id: '1',
    nombre: 'PlayStation 5 Digital Edition',
    precio: 549990,
    descripcion: 'Rendimiento de nueva generación con gráficos 4K y almacenamiento SSD ultra rápido.',
    imagen: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=500&q=80',
    tag: 'TOP VENTAS',
    tagClase: 'bg-primary'
  },
  {
    id: '2',
    nombre: 'PC Gamer ROG Strix Duoc Edition',
    precio: 1290990,
    descripcion: 'Procesador i7 13th Gen, RTX 4070, 32GB RAM DDR5. Listo para VR y Streaming.',
    imagen: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=500&q=80',
    tag: 'BENEFICIO DUOC',
    tagClase: 'bg-success'
  },
  {
    id: '3',
    nombre: 'Silla Gamer Ergonómica Pro',
    precio: 189990,
    descripcion: 'Respaldo reclinable 180°, cojín lumbar y cervical con bordes en morado neón.',
    imagen: 'https://images.unsplash.com/photo-1598550476439-6847785fcea6?w=500&q=80'
  },
  {
    id: '4',
    nombre: 'Teclado Mecánico RGB Switch Blue',
    precio: 69990,
    descripcion: 'Switches mecánicos táctiles con iluminación RGB personalizable por tecla.',
    imagen: 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=500&q=80'
  },
  {
    id: '5',
    nombre: 'Mouse Inalámbrico 26K DPI',
    precio: 49990,
    descripcion: 'Sensor óptico de alta precisión con tiempo de respuesta ultra bajo (1ms).',
    imagen: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=500&q=80'
  },
  {
    id: '6',
    nombre: 'Audífonos Gaming 7.1 Surround',
    precio: 79990,
    descripcion: 'Cancelación de ruido activa, micrófono omnidireccional y almohadillas viscoelásticas.',
    imagen: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=500&q=80',
    tag: 'NUEVO',
    tagClase: 'bg-info'
  }
];

export const Catalogo = () => {
  return (
    <Container className="my-5">
      <h1 className="text-center text-neon-green mb-2 fw-bold">CATÁLOGO DE EQUIPAMIENTO</h1>
      <p className="text-center text-neon-purple mb-5">Aprovecha el 20% de descuento usando tu correo institucional @duocuc.cl</p>
      
      <Row className="g-4">
        {productosGamer.map((prod) => (
          <Col key={prod.id} xs={12} sm={6} md={4}>
            <ProductCard {...prod} />
          </Col>
        ))}
      </Row>
    </Container>
  );
};