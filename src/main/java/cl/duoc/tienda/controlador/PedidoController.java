package cl.duoc.tienda.controlador;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import cl.duoc.tienda.dto.PedidoRequest;
import cl.duoc.tienda.modelo.Pedido;
import cl.duoc.tienda.servicio.PedidoService;
import jakarta.validation.Valid;

//   POST /api/pedidos → api.post('/pedidos', { lineas: [...] }) → 201, o 409 si falta stock
@RestController
@RequestMapping("/api/pedidos")
public class PedidoController {

    private final PedidoService servicio;

    public PedidoController(PedidoService servicio) {
        this.servicio = servicio;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Pedido crear(@Valid @RequestBody PedidoRequest solicitud) {
        return servicio.crear(solicitud);
    }
}