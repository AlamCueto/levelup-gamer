package cl.duoc.tienda.repositorio;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import cl.duoc.tienda.modelo.Categoria;

public interface CategoriaRepository extends JpaRepository<Categoria, Long> {
    Optional<Categoria> findByNombre(String nombre);
}