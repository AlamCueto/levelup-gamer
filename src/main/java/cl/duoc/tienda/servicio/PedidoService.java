package cl.duoc.tienda.servicio;

import java.time.LocalDateTime;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import cl.duoc.tienda.dto.LineaPedido;
import cl.duoc.tienda.dto.PedidoRequest;
import cl.duoc.tienda.error.RecursoNoEncontradoException;
import cl.duoc.tienda.error.StockInsuficienteException;
import cl.duoc.tienda.modelo.Pedido;
import cl.duoc.tienda.modelo.Producto;
import cl.duoc.tienda.repositorio.PedidoRepository;
import cl.duoc.tienda.repositorio.ProductoRepository;

@Service
public class PedidoService {

    private final ProductoRepository productos;
    private final PedidoRepository pedidos;

    public PedidoService(ProductoRepository productos, PedidoRepository pedidos) {
        this.productos = productos;
        this.pedidos = pedidos;
    }

    // @Transactional: o se descuenta el stock de TODAS las líneas, o de
    // ninguna. Si la tercera línea no tiene stock, las dos primeras se deshacen.
    @Transactional
    public Pedido crear(PedidoRequest solicitud) {
        int unidades = 0;
        int total = 0;

        for (LineaPedido linea : solicitud.lineas()) {
            Producto producto = productos.findById(linea.productoId())
                    .orElseThrow(() -> new RecursoNoEncontradoException(
                            "No existe el producto " + linea.productoId()));

            if (producto.getStock() < linea.cantidad()) {
                throw new StockInsuficienteException("No hay stock suficiente de «" + producto.getNombre()
                        + "»: quedan " + producto.getStock() + " unidades.");
            }

            producto.setStock(producto.getStock() - linea.cantidad());
            unidades += linea.cantidad();
            // El precio lo pone el servidor, no el carrito del navegador.
            total += producto.getPrecio() * linea.cantidad();
        }

        return pedidos.save(new Pedido(LocalDateTime.now(), unidades, total));
    }
}