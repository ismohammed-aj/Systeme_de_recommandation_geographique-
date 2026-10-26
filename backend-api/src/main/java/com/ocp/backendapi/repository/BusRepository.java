package com.ocp.backendapi.repository;

import com.ocp.backendapi.entity.Bus;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BusRepository extends JpaRepository<Bus, Integer> {
    boolean existsByMatricule(String matricule);
}
