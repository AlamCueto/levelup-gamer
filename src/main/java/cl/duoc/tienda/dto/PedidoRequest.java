package cl.duoc.tienda.dto;

import java.util.List;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;

// Cuerpo del POST /api/pedidos: { "lineas": [ { "productoId": 3, "cantidad": 2 } ] }
public record PedidoRequest(
        @NotEmpty(message = "El pedido no tiene productos") @Valid List<LineaPedido> lineas) {
}