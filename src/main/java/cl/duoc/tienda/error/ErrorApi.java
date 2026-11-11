package cl.duoc.tienda.error;

import java.util.Map;

// Forma única de todos los errores de la API. React siempre puede leer
// error.response.data.mensaje y, si hubo validación, error.response.data.campos.
//
// Ejemplo de un 400:
// { "status": 400, "mensaje": "Revisa los datos marcados",
//   "campos": { "precio": "El precio debe ser mayor que cero" } }
public record ErrorApi(int status, String mensaje, Map<String, String> campos) {
}