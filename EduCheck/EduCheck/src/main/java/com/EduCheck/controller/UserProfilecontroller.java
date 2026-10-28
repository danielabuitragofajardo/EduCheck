package com.EduCheck.controller;

import com.EduCheck.model.UserProfile;
import com.EduCheck.service.UserProfileservice;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/users")
public class UserProfilecontroller {
    @Autowired
    private UserProfileservice service;

    @GetMapping
    public List<UserProfile> getAll() { return service.findAll(); }

    @GetMapping("/{id}")
    public ResponseEntity<UserProfile> getById(@PathVariable UUID id) {
        return service.findById(id).map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<UserProfile> create(@RequestBody UserProfile user) {
        return ResponseEntity.ok(service.save(user));
    }

    @PutMapping("/{id}")
    public ResponseEntity<UserProfile> update(@PathVariable UUID id, @RequestBody UserProfile user) {
        return ResponseEntity.ok(service.update(id, user));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
