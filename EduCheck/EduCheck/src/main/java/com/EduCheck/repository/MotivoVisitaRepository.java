package com.EduCheck.repository;
import com.EduCheck.model.MotivoVisita;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface MotivoVisitaRepository extends JpaRepository<MotivoVisita, UUID> {}
