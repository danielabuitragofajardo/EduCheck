package com.EduCheck;

import com.EduCheck.model.UserProfile;
import com.EduCheck.repository.UserProfileRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootApplication
public class EduCheckApplication {

	public static void main(String[] args) {
		SpringApplication.run(EduCheckApplication.class, args);
	}

	@Bean
	public CommandLineRunner seedUsers(PasswordEncoder passwordEncoder, UserProfileRepository repository) {
		return args -> {
			UserProfile admin = new UserProfile();
			admin.setRol("ADMIN");
			admin.setPassword(passwordEncoder.encode("admin"));
			admin.setTipoUsuario("FUNCIONARIO");
			admin.setTipoDocumento("CC");
			admin.setNumeroDocumento("admin");
			admin.setNombreCompleto("Administrador EduCheck");
			admin.setEstado("ACTIVO");
			repository.save(admin);

			UserProfile vigilante = new UserProfile();
			vigilante.setRol("VIGILANTE");
			vigilante.setPassword(passwordEncoder.encode("vigilante123"));
			vigilante.setTipoUsuario("FUNCIONARIO");
			vigilante.setTipoDocumento("CC");
			vigilante.setNumeroDocumento("0000000002");
			vigilante.setNombreCompleto("Vigilante EduCheck");
			vigilante.setEstado("ACTIVO");
			repository.save(vigilante);
		};
	}

}
