package com.EduCheck.controller;

import com.EduCheck.model.Equipment;
import com.EduCheck.model.EquipmentMovement;
import com.EduCheck.service.EquipmentMovementService;
import com.EduCheck.service.Equipmentservice;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/equipment")
public class Equipmentcontroller {
    @Autowired
    private Equipmentservice service;

    @Autowired
    private EquipmentMovementService movementService;

    @GetMapping
    public List<Equipment> getAll() { return service.findAll(); }

    @GetMapping("/{id}")
    public ResponseEntity<Equipment> getById(@PathVariable UUID id) {
        try {
            return ResponseEntity.ok(service.findById(id));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public ResponseEntity<Equipment> create(@RequestBody Equipment eq) {
        if (eq.getEstado() == null) {
            eq.setEstado("DISPONIBLE");
        }
        return ResponseEntity.ok(service.save(eq));
    }

    @PutMapping("/{id}/ingress")
    public ResponseEntity<Equipment> ingress(@PathVariable UUID id) {
        return ResponseEntity.ok(service.registerIngreso(id));
    }

    @PutMapping("/{id}/assign")
    public ResponseEntity<Equipment> assign(@PathVariable UUID id, @RequestBody Equipment eq) {
        return ResponseEntity.ok(service.assign(id, eq.getIdUsuario()));
    }

    @PutMapping("/{id}/exit")
    public ResponseEntity<Equipment> exit(@PathVariable UUID id) {
        return ResponseEntity.ok(service.registerExit(id));
    }

    @GetMapping("/{id}/movements")
    public List<EquipmentMovement> movements(@PathVariable UUID id) { return movementService.findByIdEquipo(id); }
}
