package cl.duoc.tienda.servicio;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import cl.duoc.tienda.dto.LineaPedido;
import cl.duoc.tienda.dto.PedidoRequest;
import cl.duoc.tienda.error.RecursoNoEncontradoException;
import cl.duoc.tienda.error.StockInsuficienteException;
import cl.duoc.tienda.modelo.DetalleBoleta;
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

    public List<Pedido> listar() {
        return pedidos.findAll(Sort.by(Sort.Direction.DESC, "id"));
    }

    public Pedido buscar(Long id) {
        return pedidos.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException("No existe la orden " + id));
    }

    @Transactional
    public Pedido crear(PedidoRequest solicitud) {
        int unidades = 0;
        int total = 0;
        Pedido nuevoPedido = new Pedido(LocalDateTime.now(), 0, 0);

        for (LineaPedido linea : solicitud.lineas()) {
            Producto producto = productos.findById(linea.productoId())
                    .orElseThrow(() -> new RecursoNoEncontradoException(
                            "No existe el producto " + linea.productoId()));

            if (producto.getStock() < linea.cantidad()) {
                throw new StockInsuficienteException("Error: stock no disponible de «" + producto.getNombre()
                        + "» (quedan " + producto.getStock() + " unidades).");
            }

            producto.setStock(producto.getStock() - linea.cantidad());
            unidades += linea.cantidad();
            total += producto.getPrecio() * linea.cantidad();

            DetalleBoleta detalle = new DetalleBoleta(nuevoPedido, producto, linea.cantidad(), producto.getPrecio());
            nuevoPedido.agregarDetalle(detalle);
        }

        Pedido pedidoFinal = new Pedido(LocalDateTime.now(), unidades, total);
        for (DetalleBoleta det : nuevoPedido.getDetalles()) {
            pedidoFinal.agregarDetalle(det);
        }

        return pedidos.save(pedidoFinal);
    }
}