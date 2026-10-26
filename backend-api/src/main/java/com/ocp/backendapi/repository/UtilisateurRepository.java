package com.ocp.backendapi.repository;

import com.ocp.backendapi.entity.Utilisateur;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UtilisateurRepository extends JpaRepository<Utilisateur, Integer> {
    boolean existsByEmail(String email);

    boolean existsByEmailIgnoreCase(String email);

    Optional<Utilisateur> findByEmailIgnoreCase(String email);
}
