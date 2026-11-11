import axios from 'axios'

// Una sola instancia de axios para toda la aplicación.
//
// baseURL se antepone a cada ruta: api.get('/productos') pide
//   · en desarrollo:  http://localhost:8081/api/productos   (.env.development)
//   · en producción:  /api/productos                        (.env.production)
//
// timeout: si el servidor no contesta en 8 segundos, la petición se cancela
// y cae en el catch, en vez de quedar cargando para siempre.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 8000,
})

// Interceptor de petición: se ejecuta ANTES de que salga cada petición.
// Aquí solo la anotamos en la consola (F12) para ver qué se está pidiendo.
// En un proyecto con inicio de sesión, aquí se agrega el token.
if (import.meta.env.DEV) {
  api.interceptors.request.use((config) => {
    console.info('→', config.method.toUpperCase(), config.baseURL + config.url, config.params ?? '')
    return config
  })
}

export default api