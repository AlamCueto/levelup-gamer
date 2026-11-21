package cl.duoc.tienda.controlador;

import java.util.Map;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import cl.duoc.tienda.config.JwtService;
import cl.duoc.tienda.dto.LoginRequest;
import cl.duoc.tienda.dto.LoginResponse;
import cl.duoc.tienda.modelo.Usuario;
import cl.duoc.tienda.repositorio.UsuarioRepository;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthController(
            UsuarioRepository usuarioRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        if (request == null || request.getEmail() == null || request.getPassword() == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "Debe ingresar email y password"));
        }

        Optional<Usuario> usuarioOpt = usuarioRepository.findByEmail(request.getEmail().trim());
        if (usuarioOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Credenciales inválidas"));
        }

        Usuario usuario = usuarioOpt.get();
        if (!passwordEncoder.matches(request.getPassword(), usuario.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Credenciales inválidas"));
        }

        String token = jwtService.generarToken(usuario.getEmail(), usuario.getRol());
        LoginResponse response = new LoginResponse(
                token,
                usuario.getEmail(),
                usuario.getNombre(),
                usuario.getRol());

        return ResponseEntity.ok(response);
    }
}