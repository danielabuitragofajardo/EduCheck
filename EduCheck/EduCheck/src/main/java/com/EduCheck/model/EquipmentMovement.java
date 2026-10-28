package com.EduCheck.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "equipment_movements")
@Getter
@Setter
@NoArgsConstructor
public class EquipmentMovement {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID idMovimiento;

    private UUID idEquipo;
    private UUID idUsuario;
    private String tipo;
    private LocalDateTime fechaHora;
    private String observacion;
}
