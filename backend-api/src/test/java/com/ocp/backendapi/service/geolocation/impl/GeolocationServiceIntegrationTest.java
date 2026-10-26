package com.ocp.backendapi.service.geolocation.impl;

import static org.assertj.core.api.Assertions.assertThat;

import com.ocp.backendapi.dto.PositionRequestDto;
import com.ocp.backendapi.dto.RecommendationResultDto;
import com.ocp.backendapi.dto.RecommendationStopDto;
import com.ocp.backendapi.entity.LigneArret;
import com.ocp.backendapi.entity.RecommendationTrajet;
import com.ocp.backendapi.repository.LigneArretRepository;
import com.ocp.backendapi.repository.RecommendationTrajetRepository;
import com.ocp.backendapi.service.geolocation.GeolocationService;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

@SpringBootTest
@Transactional
class GeolocationServiceIntegrationTest {
    private static final double CAFE_SOULAIMAN_LATITUDE = 32.296;
    private static final double CAFE_SOULAIMAN_LONGITUDE = -9.163;
    private static final Integer CAFE_SOULAIMAN_ARRET_ID = 27;
    private static final Integer HANA_LINE_ID = 4;
    private static final Integer STAGIAIRE_ID = 1;
    private static final String STAGIAIRE_EMAIL = "stagiaire@test.com";

    @Autowired
    private GeolocationService geolocationService;

    @Autowired
    private LigneArretRepository ligneArretRepository;

    @Autowired
    private RecommendationTrajetRepository recommendationTrajetRepository;

    @Test
    void shouldResolveCafeSoulaimanToLigne4BisHana2() {
        LigneArret association = ligneArretRepository.findFirstAssociationByArretId(CAFE_SOULAIMAN_ARRET_ID)
                .orElseThrow();

        assertThat(association.getLigne().getIdLigne()).isEqualTo(HANA_LINE_ID);
        assertThat(association.getLigne().getNomLigne()).isEqualTo("LIGNE 4 BIS HANA 2");

        RecommendationResultDto result = geolocationService.findBestLineByPosition(positionAtCafeSoulaiman());

        assertThat(result.getIdArret()).isEqualTo(CAFE_SOULAIMAN_ARRET_ID);
        assertThat(result.getNomArret()).isEqualTo("CAFE SOULAIMAN");
        assertThat(result.getIdLigne()).isEqualTo(HANA_LINE_ID);
        assertThat(result.getNomLigne()).isEqualTo("LIGNE 4 BIS HANA 2");
        assertThat(result.getStops())
                .extracting(RecommendationStopDto::getNomArret)
                .contains("CAFE SOULAIMAN");
    }

    @Test
    void shouldPersistRecommendationWhenAuthenticatedStagiaireRequestsBestLineByPosition() {
        int initialCount = recommendationTrajetRepository
                .findByStagiaire_IdStagiaireOrderByDateRechercheDesc(STAGIAIRE_ID)
                .size();

        RecommendationResultDto result =
                geolocationService.findBestLineByPosition(STAGIAIRE_EMAIL, positionAtCafeSoulaiman());

        List<RecommendationTrajet> savedRecommendations = recommendationTrajetRepository
                .findByStagiaire_IdStagiaireOrderByDateRechercheDesc(STAGIAIRE_ID);

        assertThat(result.getIdStagiaire()).isEqualTo(STAGIAIRE_ID);
        assertThat(result.getIdArret()).isEqualTo(CAFE_SOULAIMAN_ARRET_ID);
        assertThat(result.getIdLigne()).isEqualTo(HANA_LINE_ID);
        assertThat(savedRecommendations).hasSize(initialCount + 1);

        RecommendationTrajet latestRecommendation = savedRecommendations.get(0);
        assertThat(latestRecommendation.getStagiaire().getIdStagiaire()).isEqualTo(STAGIAIRE_ID);
        assertThat(latestRecommendation.getLigne().getIdLigne()).isEqualTo(HANA_LINE_ID);
        assertThat(latestRecommendation.getArret().getIdArret()).isEqualTo(CAFE_SOULAIMAN_ARRET_ID);
        assertThat(latestRecommendation.getDistance()).isNotNull();
        assertThat(latestRecommendation.getDateRecherche()).isNotNull();
    }

    private PositionRequestDto positionAtCafeSoulaiman() {
        return PositionRequestDto.builder()
                .latitude(CAFE_SOULAIMAN_LATITUDE)
                .longitude(CAFE_SOULAIMAN_LONGITUDE)
                .build();
    }
}
