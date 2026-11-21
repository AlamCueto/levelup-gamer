package cl.duoc.tienda.controlador;

import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import cl.duoc.tienda.dto.PedidoRequest;
import cl.duoc.tienda.modelo.Pedido;
import cl.duoc.tienda.servicio.PedidoService;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1/pedidos")
public class PedidoController {

    private final PedidoService servicio;

    public PedidoController(PedidoService servicio) {
        this.servicio = servicio;
    }

    @GetMapping
    public List<Pedido> listar() {
        return servicio.listar();
    }

    @GetMapping("/{id}")
    public Pedido obtener(@PathVariable Long id) {
        return servicio.buscar(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Pedido crear(@Valid @RequestBody PedidoRequest solicitud) {
        return servicio.crear(solicitud);
    }
}