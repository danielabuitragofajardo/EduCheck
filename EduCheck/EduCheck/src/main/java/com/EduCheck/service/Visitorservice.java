package com.EduCheck.service;

import com.EduCheck.model.Visitors;
import com.EduCheck.repository.VisitorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service 
public class Visitorservice {
    @Autowired 
     private VisitorRepository repository;

    public List<Visitors> findAll() { return repository.findAll(); }

    public Optional<Visitors> findById(UUID idVisitante) { return repository.findById(idVisitante); }

    public Visitors registerVisitor(Visitors visitor) {
        visitor.setFechaIngreso(LocalDate.now());
        visitor.setHoraIngreso(LocalTime.now());
        return repository.save(visitor);
    }

    public Visitors registerExit(UUID id) {
        Visitors visitor = repository.findById(id).orElseThrow(() -> new RuntimeException("Visitante no encontrado"));
        visitor.setHoraSalida(LocalTime.now());
        return repository.save(visitor);
    }
}
