package cl.duoc.tienda.error;

// Se lanza cuando se pide un id que no existe. El manejador de errores la
// convierte en una respuesta 404.
public class RecursoNoEncontradoException extends RuntimeException {

    public RecursoNoEncontradoException(String mensaje) {
        super(mensaje);
    }
}