package com.EduCheck.service;

import com.EduCheck.model.AccessMovement;
import com.EduCheck.repository.AccessMovementRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class AccessMovementService {
    @Autowired
    private AccessMovementRepository repository;

    public List<AccessMovement> findAll() { return repository.findAll(); }

    public List<AccessMovement> findByIdUsuario(UUID idUsuario) { return repository.findByIdUsuarioOrderByFechaHoraAsc(idUsuario); }

    public AccessMovement registerIngreso(AccessMovement movement) {
        movement.setTipo("INGRESO");
        movement.setFechaHora(LocalDateTime.now());
        return repository.save(movement);
    }

    public AccessMovement registerSalida(AccessMovement movement) {
        movement.setTipo("SALIDA");
        movement.setFechaHora(LocalDateTime.now());
        return repository.save(movement);
    }
}
