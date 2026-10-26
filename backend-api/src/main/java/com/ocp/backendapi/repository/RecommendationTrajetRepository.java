package com.ocp.backendapi.repository;

import com.ocp.backendapi.entity.RecommendationTrajet;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RecommendationTrajetRepository extends JpaRepository<RecommendationTrajet, Integer> {
    List<RecommendationTrajet> findByStagiaire_IdStagiaireOrderByDateRechercheDesc(Integer idStagiaire);
}
