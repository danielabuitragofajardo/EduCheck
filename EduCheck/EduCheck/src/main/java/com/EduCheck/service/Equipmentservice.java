package com.EduCheck.service;

import com.EduCheck.model.Equipment;
import com.EduCheck.repository.EquipmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.UUID;

@Service 
public class Equipmentservice {
    @Autowired 
    private EquipmentRepository repository;

    @Autowired
    private EquipmentMovementService movementService;

    public List<Equipment> findAll(){return repository.findAll();}
    public Equipment findById(UUID idEquipo){return repository.findById(idEquipo).orElseThrow(() -> new RuntimeException("Equipo no encontrado"));}
    public Equipment save (Equipment eq) {return repository.save(eq);}

    public Equipment registerIngreso(UUID idEquipo) {
        Equipment eq = findById(idEquipo);
        eq.setEstado("PRESTAMADO");
        Equipment saved = repository.save(eq);
        movementService.registerIngreso(saved);
        return saved;
    }

    public Equipment assign(UUID idEquipo, UUID idUsuario) {
        Equipment eq = findById(idEquipo);
        eq.setIdUsuario(idUsuario);
        eq.setEstado("PRESTAMADO");
        Equipment saved = repository.save(eq);
        movementService.registerIngreso(saved);
        return saved;
    }

    public Equipment registerExit(UUID idEquipo) {
        Equipment eq = findById(idEquipo);
        eq.setEstado("DISPONIBLE");
        Equipment saved = repository.save(eq);
        movementService.registerSalida(saved);
        return saved;
    }
}
