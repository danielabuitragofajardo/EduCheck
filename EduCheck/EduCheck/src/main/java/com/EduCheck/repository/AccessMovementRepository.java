package com.EduCheck.repository;
import com.EduCheck.model.AccessMovement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface AccessMovementRepository extends JpaRepository<AccessMovement, UUID> {
    List<AccessMovement> findByIdUsuarioOrderByFechaHoraAsc(UUID idUsuario);
}
