package cl.duoc.tienda;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import org.junit.jupiter.api.Test;
import static org.mockito.ArgumentMatchers.any;
import org.mockito.Mockito;
import static org.mockito.Mockito.when;

import cl.duoc.tienda.dto.LineaPedido;
import cl.duoc.tienda.dto.PedidoRequest;
import cl.duoc.tienda.error.StockInsuficienteException;
import cl.duoc.tienda.modelo.Pedido;
import cl.duoc.tienda.modelo.Producto;
import cl.duoc.tienda.repositorio.PedidoRepository;
import cl.duoc.tienda.repositorio.ProductoRepository;
import cl.duoc.tienda.servicio.PedidoService;

class PedidoServiceTest {

    @Test
    void crearPedidoDescuentaStockYCalculaTotal() {
        ProductoRepository prodRepo = Mockito.mock(ProductoRepository.class);
        PedidoRepository pedRepo = Mockito.mock(PedidoRepository.class);
        PedidoService service = new PedidoService(prodRepo, pedRepo);

        Producto mouse = new Producto("Mouse Gamer", "computacion", 25000, 10, "Desc", "🖱️");
        mouse.setId(1L);

        when(prodRepo.findById(1L)).thenReturn(Optional.of(mouse));
        when(pedRepo.save(any(Pedido.class))).thenAnswer(inv -> inv.getArgument(0));

        PedidoRequest request = new PedidoRequest(List.of(new LineaPedido(1L, 3)));
        Pedido resultado = service.crear(request);

        assertEquals(7, mouse.getStock());
        assertEquals(3, resultado.getUnidades());
        assertEquals(75000, resultado.getTotal());
    }

    @Test
    void crearPedidoSinStockLanzaExcepcion() {
        ProductoRepository prodRepo = Mockito.mock(ProductoRepository.class);
        PedidoRepository pedRepo = Mockito.mock(PedidoRepository.class);
        PedidoService service = new PedidoService(prodRepo, pedRepo);

        Producto monitor = new Producto("Monitor 27", "computacion", 190000, 2, "Desc", "🖥️");
        monitor.setId(2L);

        when(prodRepo.findById(2L)).thenReturn(Optional.of(monitor));

        PedidoRequest request = new PedidoRequest(List.of(new LineaPedido(2L, 5)));

        assertThrows(StockInsuficienteException.class, () -> service.crear(request));
        assertEquals(2, monitor.getStock()); // El stock no debe modificarse
    }
}