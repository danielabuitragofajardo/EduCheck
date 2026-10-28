package com.EduCheck.model;

import jakarta.persistence.*;
import java.util.UUID;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "motivos_visita")
@Getter
@Setter
@NoArgsConstructor
public class MotivoVisita {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID idMotivoVisita;

    private String nombre;
    private String descripcion;
}
