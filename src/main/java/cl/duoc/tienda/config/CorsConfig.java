package cl.duoc.tienda.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

// En desarrollo React corre en http://localhost:5173 y la API en
// http://localhost:8080. Son dos orígenes distintos, así que el navegador
// bloquea las respuestas salvo que la API diga explícitamente que confía en 5173.
//
// En producción (EC2 con Nginx) ambos se sirven desde el mismo origen y esta
// clase deja de intervenir.
@Configuration
public class CorsConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins("http://localhost:5173")
                .allowedMethods("GET", "POST", "PUT", "DELETE")
                .allowedHeaders("*");
    }
}