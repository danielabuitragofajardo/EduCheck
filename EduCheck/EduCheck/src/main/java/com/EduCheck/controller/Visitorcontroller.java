package com.EduCheck.controller;

import com.EduCheck.model.Visitors;
import com.EduCheck.service.Visitorservice;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/visitors")
public class Visitorcontroller {
    @Autowired
    private Visitorservice service;

    @GetMapping
    public List<Visitors> getAll() { return service.findAll(); }

    @GetMapping("/{id}")
    public ResponseEntity<Visitors> getById(@PathVariable UUID id) {
        return service.findById(id).map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Visitors> register(@RequestBody Visitors visitor) {
        return ResponseEntity.ok(service.registerVisitor(visitor));
    }

    @PutMapping("/{id}/exit")
    public ResponseEntity<Visitors> exit(@PathVariable UUID id) {
        return ResponseEntity.ok(service.registerExit(id));
    }
}
