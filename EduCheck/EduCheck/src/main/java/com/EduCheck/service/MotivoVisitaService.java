package com.EduCheck.service;

import com.EduCheck.model.MotivoVisita;
import com.EduCheck.repository.MotivoVisitaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.UUID;

@Service
public class MotivoVisitaService {
    @Autowired
    private MotivoVisitaRepository repository;

    public List<MotivoVisita> findAll() { return repository.findAll(); }

    public MotivoVisita save(MotivoVisita motivo) { return repository.save(motivo); }

    public void delete(UUID idMotivoVisita) { repository.deleteById(idMotivoVisita); }
}
