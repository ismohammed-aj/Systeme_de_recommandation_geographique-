package com.ocp.backendapi.repository;

import com.ocp.backendapi.entity.Arret;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ArretRepository extends JpaRepository<Arret, Integer> {
}
