package cl.duoc.tienda.controlador;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import cl.duoc.tienda.modelo.Producto;
import cl.duoc.tienda.servicio.ProductoService;
import jakarta.validation.Valid;

// Los cinco endpoints que consume React con axios:
//
//   GET    /api/productos            → api.get('/productos')
//   GET    /api/productos?categoria= → api.get('/productos', { params: { categoria } })
//   GET    /api/productos/{id}       → api.get(`/productos/${id}`)
//   POST   /api/productos            → api.post('/productos', producto)      → 201
//   PUT    /api/productos/{id}       → api.put(`/productos/${id}`, producto)  → 200
//   DELETE /api/productos/{id}       → api.delete(`/productos/${id}`)         → 204
@RestController
@RequestMapping("/api/productos")
public class ProductoController {

    private final ProductoService servicio;

    public ProductoController(ProductoService servicio) {
        this.servicio = servicio;
    }

    @GetMapping
    public List<Producto> listar(@RequestParam(required = false) String categoria) {
        return servicio.listar(categoria);
    }

    @GetMapping("/{id}")
    public Producto obtener(@PathVariable Long id) {
        return servicio.buscar(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Producto crear(@Valid @RequestBody Producto producto) {
        return servicio.crear(producto);
    }

    @PutMapping("/{id}")
    public Producto actualizar(@PathVariable Long id, @Valid @RequestBody Producto producto) {
        return servicio.actualizar(id, producto);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void eliminar(@PathVariable Long id) {
        servicio.eliminar(id);
    }
}