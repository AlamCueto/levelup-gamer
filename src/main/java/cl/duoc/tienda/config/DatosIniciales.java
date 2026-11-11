package cl.duoc.tienda.config;

import java.util.List;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import cl.duoc.tienda.modelo.Producto;
import cl.duoc.tienda.repositorio.ProductoRepository;

// Se ejecuta una vez al arrancar la API y carga el mismo catálogo que antes
// vivía en src/datos/productos.js del proyecto React.
@Component
public class DatosIniciales implements CommandLineRunner {

    private final ProductoRepository repositorio;

    public DatosIniciales(ProductoRepository repositorio) {
        this.repositorio = repositorio;
    }

    @Override
    public void run(String... args) {
        if (repositorio.count() > 0) {
            return;
        }
        repositorio.saveAll(List.of(
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
}