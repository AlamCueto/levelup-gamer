package cl.duoc.tienda.modelo;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

// Registro simple de cada compra: cuándo, cuántas unidades y cuánto se cobró.
@Entity
public class Pedido {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDateTime fecha;
    private Integer unidades;
    private Integer total;

    public Pedido() {
    }

    public Pedido(LocalDateTime fecha, Integer unidades, Integer total) {
        this.fecha = fecha;
        this.unidades = unidades;
        this.total = total;
    }

    public Long getId() { return id; }
    public LocalDateTime getFecha() { return fecha; }
    public Integer getUnidades() { return unidades; }
    public Integer getTotal() { return total; }
}