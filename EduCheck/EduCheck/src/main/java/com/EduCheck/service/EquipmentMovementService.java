package com.EduCheck.service;

import com.EduCheck.model.Equipment;
import com.EduCheck.model.EquipmentMovement;
import com.EduCheck.repository.EquipmentMovementRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class EquipmentMovementService {
    @Autowired
    private EquipmentMovementRepository repository;

    public List<EquipmentMovement> findAll() { return repository.findAllByOrderByFechaHoraDesc(); }

    public List<EquipmentMovement> findByIdEquipo(UUID idEquipo) { return repository.findByIdEquipoOrderByFechaHoraAsc(idEquipo); }

    public EquipmentMovement registerIngreso(Equipment equipment) {
        EquipmentMovement movement = new EquipmentMovement();
        movement.setIdEquipo(equipment.getIdEquipo());
        movement.setIdUsuario(equipment.getIdUsuario());
        movement.setTipo("INGRESO");
        movement.setFechaHora(LocalDateTime.now());
        return repository.save(movement);
    }

    public EquipmentMovement registerSalida(Equipment equipment) {
        EquipmentMovement movement = new EquipmentMovement();
        movement.setIdEquipo(equipment.getIdEquipo());
        movement.setIdUsuario(equipment.getIdUsuario());
        movement.setTipo("SALIDA");
        movement.setFechaHora(LocalDateTime.now());
        return repository.save(movement);
    }
}
