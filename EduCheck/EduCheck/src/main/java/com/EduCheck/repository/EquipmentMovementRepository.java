package com.EduCheck.repository;
import com.EduCheck.model.EquipmentMovement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface EquipmentMovementRepository extends JpaRepository<EquipmentMovement, UUID> {
    List<EquipmentMovement> findAllByOrderByFechaHoraDesc();
    List<EquipmentMovement> findByIdEquipoOrderByFechaHoraAsc(UUID idEquipo);
}
