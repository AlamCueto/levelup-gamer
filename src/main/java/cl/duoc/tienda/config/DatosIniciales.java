package cl.duoc.tienda.config;

import java.util.List;

import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import cl.duoc.tienda.modelo.Categoria;
import cl.duoc.tienda.modelo.Producto;
import cl.duoc.tienda.modelo.Usuario;
import cl.duoc.tienda.repositorio.CategoriaRepository;
import cl.duoc.tienda.repositorio.ProductoRepository;
import cl.duoc.tienda.repositorio.UsuarioRepository;

@Component
public class DatosIniciales implements CommandLineRunner {

    private final CategoriaRepository categoriaRepository;
    private final ProductoRepository productoRepository;
    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    public DatosIniciales(
            CategoriaRepository categoriaRepository,
            ProductoRepository productoRepository,
            UsuarioRepository usuarioRepository,
            PasswordEncoder passwordEncoder) {
        this.categoriaRepository = categoriaRepository;
        this.productoRepository = productoRepository;
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        cargarCategorias();
        cargarProductos();
        cargarUsuarios();
    }

    private void cargarCategorias() {
        if (categoriaRepository.count() > 0) {
            return;
        }
        categoriaRepository.saveAll(List.of(
                new Categoria("audio"),
                new Categoria("computacion"),
                new Categoria("hogar")
        ));
    }

    private void cargarProductos() {
        if (productoRepository.count() > 0) {
            return;
        }
        productoRepository.saveAll(List.of(
                new Producto("Audífonos inalámbricos Onda", "audio", 39990, 12,
                        "Audífonos bluetooth con cancelación pasiva de ruido y 24 horas de autonomía con el estuche de carga.", "🎧"),
                new Producto("Parlante portátil Roca", "audio", 54990, 5,
                        "Parlante resistente a salpicaduras, con correa de transporte y 10 horas de reproducción continua.", "🔊"),
                new Producto("Teclado mecánico Cordillera", "computacion", 74990, 8,
                        "Teclado mecánico de 87 teclas, distribución en español latinoamericano e iluminación regulable.", "⌨️"),
                new Producto("Mouse ergonómico Pehuén", "computacion", 24990, 20,
                        "Mouse vertical inalámbrico que reduce la tensión de la muñeca en jornadas largas de trabajo.", "🖱️"),
                new Producto("Monitor 27\" Atacama", "computacion", 189990, 3,
                        "Monitor IPS de 27 pulgadas, resolución QHD y 100 Hz de refresco. Incluye soporte regulable en altura.", "🖥️"),
                new Producto("Lámpara de escritorio Aurora", "hogar", 19990, 15,
                        "Lámpara LED con tres temperaturas de color y puerto USB para cargar el teléfono.", "💡"),
                new Producto("Silla de escritorio Valle", "hogar", 129990, 0,
                        "Silla ergonómica con apoyo lumbar regulable y respaldo de malla transpirable.", "🪑"),
                new Producto("Cámara web Mirador HD", "computacion", 32990, 9,
                        "Cámara web 1080p con micrófono estéreo y tapa de privacidad incorporada.", "📷")));
    }

    private void cargarUsuarios() {
        if (usuarioRepository.count() > 0) {
            return;
        }
        usuarioRepository.saveAll(List.of(
                new Usuario("Administrador LevelUp", "admin@levelup.cl", passwordEncoder.encode("Admin1234*"), "ROLE_ADMIN"),
                new Usuario("Vendedor LevelUp", "vendedor@levelup.cl", passwordEncoder.encode("Vendedor1234*"), "ROLE_VENDEDOR"),
                new Usuario("Cliente Duoc", "cliente@duoc.cl", passwordEncoder.encode("Cliente1234*"), "ROLE_CLIENTE")));
    }
}