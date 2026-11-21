// Convierte cualquier error de axios en un mensaje que se puede mostrar.
//
// A diferencia de fetch, axios RECHAZA la promesa cuando el servidor responde
// 4xx o 5xx, así que todos los errores llegan al catch. Hay tres casos:
export function mensajeDeError(error) {
  // 1. El servidor respondió, pero con un código de error (400, 404, 409, 500…).
  //    Nuestra API siempre manda { status, mensaje, campos }.
  if (error.response) {
    return error.response.data?.mensaje ?? `El servidor respondió con el error ${error.response.status}.`
  }

  // 2. La petición salió, pero no volvió ninguna respuesta: la API está
  //    apagada, la URL es incorrecta, se agotó el tiempo o CORS la bloqueó.
  if (error.request) {
    return 'No hay conexión con el servidor. Revisa que la API de Spring Boot esté corriendo.'
  }

  // 3. El error ocurrió antes de enviar (por ejemplo, un error de programación).
  return error.message
}