package com.EduCheck.controller;

import com.EduCheck.model.MotivoVisita;
import com.EduCheck.service.MotivoVisitaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/motivos")
public class MotivoVisitaController {
    @Autowired
    private MotivoVisitaService service;

    @GetMapping
    public List<MotivoVisita> getAll() { return service.findAll(); }

    @PostMapping
    public ResponseEntity<MotivoVisita> create(@RequestBody MotivoVisita motivo) { return ResponseEntity.ok(service.save(motivo)); }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) { service.delete(id); return ResponseEntity.noContent().build(); }
}
