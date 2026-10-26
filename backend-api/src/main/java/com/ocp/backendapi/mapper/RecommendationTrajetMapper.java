package com.ocp.backendapi.mapper;

import com.ocp.backendapi.dto.RecommendationTrajetDto;
import com.ocp.backendapi.entity.Arret;
import com.ocp.backendapi.entity.Ligne;
import com.ocp.backendapi.entity.RecommendationTrajet;
import com.ocp.backendapi.entity.Stagiaire;
import org.springframework.stereotype.Component;

@Component
public class RecommendationTrajetMapper {
    public RecommendationTrajetDto toDto(RecommendationTrajet recommendationTrajet) {
        if (recommendationTrajet == null) {
            return null;
        }

        Integer idStagiaire = recommendationTrajet.getStagiaire() == null
                ? null
                : recommendationTrajet.getStagiaire().getIdStagiaire();
        Integer idLigne = recommendationTrajet.getLigne() == null
                ? null
                : recommendationTrajet.getLigne().getIdLigne();
        Integer idArret = recommendationTrajet.getArret() == null
                ? null
                : recommendationTrajet.getArret().getIdArret();

        return RecommendationTrajetDto.builder()
                .idRecommandation(recommendationTrajet.getIdRecommandation())
                .idStagiaire(idStagiaire)
                .idLigne(idLigne)
                .idArret(idArret)
                .distance(recommendationTrajet.getDistance())
                .dateRecherche(recommendationTrajet.getDateRecherche())
                .build();
    }

    public RecommendationTrajet toEntity(
            RecommendationTrajetDto recommendationTrajetDto,
            Stagiaire stagiaire,
            Ligne ligne,
            Arret arret) {
        if (recommendationTrajetDto == null) {
            return null;
        }

        return RecommendationTrajet.builder()
                .idRecommandation(recommendationTrajetDto.getIdRecommandation())
                .stagiaire(stagiaire)
                .ligne(ligne)
                .arret(arret)
                .distance(recommendationTrajetDto.getDistance())
                .dateRecherche(recommendationTrajetDto.getDateRecherche())
                .build();
    }

    public void updateEntityFromDto(
            RecommendationTrajetDto recommendationTrajetDto,
            RecommendationTrajet recommendationTrajet,
            Stagiaire stagiaire,
            Ligne ligne,
            Arret arret) {
        recommendationTrajet.setStagiaire(stagiaire);
        recommendationTrajet.setLigne(ligne);
        recommendationTrajet.setArret(arret);
        recommendationTrajet.setDistance(recommendationTrajetDto.getDistance());
        recommendationTrajet.setDateRecherche(recommendationTrajetDto.getDateRecherche());
    }
}
