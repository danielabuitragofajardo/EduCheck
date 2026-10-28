package com.EduCheck.service;

import com.EduCheck.model.UserProfile;
import com.EduCheck.repository.UserProfileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class UserProfileservice {
    @Autowired
    private UserProfileRepository repository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public List<UserProfile> findAll() { return repository.findAll(); }

    public Optional<UserProfile> findById(UUID idUsuario) { return repository.findById(idUsuario); }

    public Optional<UserProfile> findByNumeroDocumento(String numeroDocumento) { return repository.findByNumeroDocumento(numeroDocumento); }

    public UserProfile save(UserProfile user) {
        if (user.getPassword() != null) {
            user.setPassword(passwordEncoder.encode(user.getPassword()));
        }
        return repository.save(user);
    }

    public UserProfile update(UUID idUsuario, UserProfile user) {
        UserProfile current = repository.findById(idUsuario)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        current.setRol(user.getRol());
        if (user.getPassword() != null) {
            current.setPassword(passwordEncoder.encode(user.getPassword()));
        }
        current.setTipoUsuario(user.getTipoUsuario());
        current.setTipoDocumento(user.getTipoDocumento());
        current.setNumeroDocumento(user.getNumeroDocumento());
        current.setNombreCompleto(user.getNombreCompleto());
        current.setEstado(user.getEstado());
        return repository.save(current);
    }

    public void delete(UUID idUsuario) { repository.deleteById(idUsuario); }

    public List<UserProfile> findByRol(String rol) { return repository.findByRol(rol); }
}
