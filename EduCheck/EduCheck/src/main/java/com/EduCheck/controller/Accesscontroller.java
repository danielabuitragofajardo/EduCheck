package com.EduCheck.controller;

import com.EduCheck.model.AccessMovement;
import com.EduCheck.service.AccessMovementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/access")
public class Accesscontroller {

    @Autowired
    private AccessMovementService service;

    @GetMapping
    public List<AccessMovement> getAll() { return service.findAll(); }

    @GetMapping("/user/{idUsuario}")
    public List<AccessMovement> getByUser(@PathVariable java.util.UUID idUsuario) { return service.findByIdUsuario(idUsuario); }

    @PostMapping
    public ResponseEntity<AccessMovement> register(@RequestBody AccessMovement movement) {
        AccessMovement result = movement.getTipo() != null && movement.getTipo().equalsIgnoreCase("SALIDA")
                ? service.registerSalida(movement)
                : service.registerIngreso(movement);
        return ResponseEntity.ok(result);
    }
}
