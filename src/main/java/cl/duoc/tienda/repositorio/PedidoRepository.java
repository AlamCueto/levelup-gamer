package cl.duoc.tienda.repositorio;

import org.springframework.data.jpa.repository.JpaRepository;

import cl.duoc.tienda.modelo.Pedido;

public interface PedidoRepository extends JpaRepository<Pedido, Long> {
}