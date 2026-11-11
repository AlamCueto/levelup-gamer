package cl.duoc.tienda.error;

// Se lanza cuando un pedido pide más unidades de las que hay. Se responde 409
// (Conflict): la solicitud está bien escrita, pero choca con el estado actual.
public class StockInsuficienteException extends RuntimeException {

    public StockInsuficienteException(String mensaje) {
        super(mensaje);
    }
}