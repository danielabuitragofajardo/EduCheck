package com.EduCheck.repository;
import com.EduCheck.model.UserProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;
import java.util.List;

@Repository
public interface UserProfileRepository extends JpaRepository<UserProfile, UUID> {
    Optional<UserProfile> findByNumeroDocumento(String numeroDocumento);
    List<UserProfile> findByRol(String rol);
}
