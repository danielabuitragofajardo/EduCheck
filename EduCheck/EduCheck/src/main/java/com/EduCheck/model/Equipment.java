package com.EduCheck.model;

import jakarta.persistence.*;
import java.util.UUID;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;


@Entity
@Table(name = "equipment")
@Getter
@Setter
@NoArgsConstructor
public class Equipment {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID idEquipo;

    private String tipo;
    private String serial;
    private String marca;
    private UUID idUsuario;
    private String estado;
}
