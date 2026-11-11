package cl.duoc.tienda.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

// Una línea del carrito tal como la envía React: qué producto y cuántas unidades.
// El precio NO viaja: lo pone el servidor, que es el único en el que se puede confiar.
public record LineaPedido(
        @NotNull(message = "Falta el producto") Long productoId,
        @NotNull(message = "Falta la cantidad") @Min(value = 1, message = "La cantidad mínima es 1") Integer cantidad) {
}