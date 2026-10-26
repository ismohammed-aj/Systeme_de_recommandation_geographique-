package com.ocp.backendapi.repository;

import com.ocp.backendapi.entity.Ligne;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LigneRepository extends JpaRepository<Ligne, Integer> {
}
