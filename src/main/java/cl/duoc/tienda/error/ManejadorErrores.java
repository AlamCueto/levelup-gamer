package cl.duoc.tienda.error;

import java.util.LinkedHashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

// Atrapa las excepciones de todos los controladores y las convierte en
// respuestas con el código HTTP correcto y un cuerpo ErrorApi.
@RestControllerAdvice
public class ManejadorErrores {

    // 404: el id pedido no existe.
    @ExceptionHandler(RecursoNoEncontradoException.class)
    public ResponseEntity<ErrorApi> noEncontrado(RecursoNoEncontradoException ex) {
        return responder(HttpStatus.NOT_FOUND, ex.getMessage(), Map.of());
    }

    // 409: no alcanza el stock para el pedido.
    @ExceptionHandler(StockInsuficienteException.class)
    public ResponseEntity<ErrorApi> sinStock(StockInsuficienteException ex) {
        return responder(HttpStatus.CONFLICT, ex.getMessage(), Map.of());
    }

    // 400: falló @Valid. Devolvemos un mensaje por campo para que el
    // formulario de React pueda marcar cada input.
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorApi> datosInvalidos(MethodArgumentNotValidException ex) {
        Map<String, String> campos = new LinkedHashMap<>();
        for (FieldError error : ex.getBindingResult().getFieldErrors()) {
            campos.putIfAbsent(error.getField(), error.getDefaultMessage());
        }
        return responder(HttpStatus.BAD_REQUEST, "Revisa los datos marcados", campos);
    }

    // 400: /api/productos/abc — el id no es un número.
    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<ErrorApi> tipoIncorrecto(MethodArgumentTypeMismatchException ex) {
        return responder(HttpStatus.BAD_REQUEST, "El valor «" + ex.getValue() + "» no es válido", Map.of());
    }

    private ResponseEntity<ErrorApi> responder(HttpStatus estado, String mensaje, Map<String, String> campos) {
        return ResponseEntity.status(estado).body(new ErrorApi(estado.value(), mensaje, campos));
    }
}