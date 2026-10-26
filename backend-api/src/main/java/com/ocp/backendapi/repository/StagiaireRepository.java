package com.ocp.backendapi.repository;

import com.ocp.backendapi.entity.Stagiaire;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StagiaireRepository extends JpaRepository<Stagiaire, Integer> {
    boolean existsByUtilisateur_IdUtilisateur(Integer idUtilisateur);

    Optional<Stagiaire> findByUtilisateur_EmailIgnoreCase(String email);

    List<Stagiaire> findByPositionSharedTrueAndLatitudeIsNotNullAndLongitudeIsNotNull();
}
