package cl.duoc.tienda.repositorio;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import cl.duoc.tienda.modelo.Producto;

public interface ProductoRepository extends JpaRepository<Producto, Long> {

    // Spring Data arma la consulta a partir del nombre del método:
    // SELECT * FROM producto WHERE categoria = ? ORDER BY id
    List<Producto> findByCategoriaOrderById(String categoria);
}