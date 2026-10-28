package com.EduCheck.model;

import jakarta.persistence.*;
import java.util.UUID; 
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;


@Entity
@Table(name = "user_profiles")
@Getter
@Setter
@NoArgsConstructor
public class UserProfile {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID idUsuario;

    private String rol;
    private String password;
    private String tipoUsuario; 
    private String tipoDocumento;
    private String numeroDocumento;
    private String nombreCompleto; 
    private String estado;
}
