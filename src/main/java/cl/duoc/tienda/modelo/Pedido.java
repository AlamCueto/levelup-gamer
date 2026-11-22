package cl.duoc.tienda.modelo;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.*;

@Entity
@Table(name = "boleta")
public class Pedido {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDateTime fecha;
    private Integer unidades;
    private Integer total;

    @OneToMany(mappedBy = "pedido", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    private List<DetalleBoleta> detalles = new ArrayList<>();

    public Pedido() {
    }

    public Pedido(LocalDateTime fecha, Integer unidades, Integer total) {
        this.fecha = fecha;
        this.unidades = unidades;
        this.total = total;
    }

    public void agregarDetalle(DetalleBoleta detalle) {
        detalles.add(detalle);
        detalle.setPedido(this);
    }

    public Long getId() { return id; }
    public LocalDateTime getFecha() { return fecha; }
    public Integer getUnidades() { return unidades; }
    public Integer getTotal() { return total; }
    public List<DetalleBoleta> getDetalles() { return detalles; }
}