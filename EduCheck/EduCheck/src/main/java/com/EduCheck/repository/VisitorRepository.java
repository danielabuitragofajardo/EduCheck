package com.EduCheck.repository;
import com.EduCheck.model.Visitors;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface VisitorRepository extends JpaRepository<Visitors, UUID> {
}
