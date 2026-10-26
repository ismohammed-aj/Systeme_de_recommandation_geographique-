package com.ocp.backendapi.repository;

import com.ocp.backendapi.entity.Chauffeur;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ChauffeurRepository extends JpaRepository<Chauffeur, Integer> {
}
