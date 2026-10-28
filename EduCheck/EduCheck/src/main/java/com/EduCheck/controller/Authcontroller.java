package com.EduCheck.controller;

import com.EduCheck.dto.AuthRequest;
import com.EduCheck.model.UserProfile;
import com.EduCheck.service.UserProfileservice;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class Authcontroller {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserProfileservice userService;

    private Map<String, Object> toUserResponse(UserProfile user) {
        Map<String, Object> data = new HashMap<>();
        data.put("idUsuario", user.getIdUsuario());
        data.put("rol", user.getRol());
        data.put("tipoUsuario", user.getTipoUsuario());
        data.put("tipoDocumento", user.getTipoDocumento());
        data.put("numeroDocumento", user.getNumeroDocumento());
        data.put("nombreCompleto", user.getNombreCompleto());
        data.put("estado", user.getEstado());
        return data;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest request) {
        try {
            Authentication auth = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword()));
            SecurityContext context = SecurityContextHolder.createEmptyContext();
            context.setAuthentication(auth);
            SecurityContextHolder.setContext(context);
            ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
            HttpServletRequest httpRequest = attributes.getRequest();
            HttpServletResponse httpResponse = attributes.getResponse();
            new HttpSessionSecurityContextRepository().saveContext(context, httpRequest, httpResponse);
            UserProfile user = userService.findByNumeroDocumento(auth.getName()).orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
            return ResponseEntity.ok(toUserResponse(user));
        } catch (Exception e) {
            return ResponseEntity.status(401).body(Map.of("message", "Credenciales inválidas"));
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout() {
        SecurityContextHolder.clearContext();
        ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        HttpServletRequest request = attributes.getRequest();
        HttpSession session = request.getSession(false);
        if (session != null) {
            session.invalidate();
        }
        return ResponseEntity.ok(Map.of("message", "Sesión cerrada"));
    }

    @GetMapping("/me")
    public ResponseEntity<?> me() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) {
            return ResponseEntity.status(401).body(Map.of("message", "No autenticado"));
        }
        UserProfile user = userService.findByNumeroDocumento(auth.getName()).orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        return ResponseEntity.ok(toUserResponse(user));
    }
}
