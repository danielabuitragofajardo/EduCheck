package com.EduCheck.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.UUID;

@Entity
@Table(name = "visitors")
@Getter
@Setter
@NoArgsConstructor
public class Visitors {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID idVisitante;

    private String tipoDocumento;
    private String numeroDocumento;
    private String nombreCompleto;
    private LocalDate fechaIngreso;
    private LocalTime horaIngreso;
    private LocalTime horaSalida;
    private UUID idMotivoVisita;
}
