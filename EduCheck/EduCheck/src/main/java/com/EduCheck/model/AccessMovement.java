package com.EduCheck.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "access_movements")
@Getter
@Setter
@NoArgsConstructor
public class AccessMovement {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID idMovimiento;

    private UUID idUsuario;
    private String tipo;
    private LocalDateTime fechaHora;
    private String observacion;
}
