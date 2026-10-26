package com.ocp.backendapi.service.geolocation.impl;

import com.ocp.backendapi.dto.PositionRequestDto;
import com.ocp.backendapi.dto.RecommendationResultDto;
import com.ocp.backendapi.dto.RecommendationStopDto;
import com.ocp.backendapi.entity.Arret;
import com.ocp.backendapi.entity.LigneArret;
import com.ocp.backendapi.entity.RecommendationTrajet;
import com.ocp.backendapi.entity.Stagiaire;
import com.ocp.backendapi.exception.ResourceNotFoundException;
import com.ocp.backendapi.repository.ArretRepository;
import com.ocp.backendapi.repository.LigneArretRepository;
import com.ocp.backendapi.repository.RecommendationTrajetRepository;
import com.ocp.backendapi.repository.StagiaireRepository;
import com.ocp.backendapi.service.geolocation.GeolocationService;
import java.time.LocalDateTime;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class GeolocationServiceImpl implements GeolocationService {
    private static final double EARTH_RADIUS_KM = 6371.0;

    private final StagiaireRepository stagiaireRepository;
    private final ArretRepository arretRepository;
    private final LigneArretRepository ligneArretRepository;
    private final RecommendationTrajetRepository recommendationTrajetRepository;

    @Override
    @Transactional
    public RecommendationResultDto findBestLineForStagiaire(Integer idStagiaire) {
        Stagiaire stagiaire = findStagiaireById(idStagiaire);
        validateStagiaireCoordinates(stagiaire);

        return findBestLine(stagiaire, stagiaire.getLatitude(), stagiaire.getLongitude());
    }

    @Override
    public RecommendationResultDto findBestLineByPosition(PositionRequestDto request) {
        return findBestLineByPosition(null, request);
    }

    @Override
    @Transactional
    public RecommendationResultDto findBestLineByPosition(String email, PositionRequestDto request) {
        validatePositionRequest(request);
        Stagiaire stagiaire = findStagiaireByEmail(email);

        return findBestLine(stagiaire, request.getLatitude(), request.getLongitude());
    }

    private RecommendationResultDto findBestLine(Stagiaire stagiaire, Double latitude, Double longitude) {
        List<Arret> arrets = arretRepository.findAll();
        if (arrets.isEmpty()) {
            throw new ResourceNotFoundException("Aucun arret disponible");
        }

        Arret nearestArret = null;
        double nearestDistance = Double.MAX_VALUE;

        for (Arret arret : arrets) {
            if (arret.getLatitude() == null || arret.getLongitude() == null) {
                continue;
            }

            double distance = calculateDistanceInKilometers(
                    latitude,
                    longitude,
                    arret.getLatitude(),
                    arret.getLongitude());

            if (distance < nearestDistance) {
                nearestDistance = distance;
                nearestArret = arret;
            }
        }

        if (nearestArret == null) {
            throw new ResourceNotFoundException("Aucun arret avec coordonnees GPS disponible");
        }

        Arret selectedArret = nearestArret;
        LigneArret ligneArret = ligneArretRepository
                .findFirstAssociationByArretId(selectedArret.getIdArret())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Aucune ligne associee a l'arret : " + selectedArret.getNomArret()));
        Integer idLigne = ligneArret.getLigne().getIdLigne();
        List<RecommendationStopDto> stops = ligneArretRepository.findAssociationsByLigneIdOrderByOrdreAsc(idLigne)
                .stream()
                .map(this::toRecommendationStopDto)
                .toList();
        Integer idStagiaire = stagiaire == null ? null : stagiaire.getIdStagiaire();

        if (stagiaire != null) {
            saveRecommendation(stagiaire, ligneArret, selectedArret, nearestDistance);
        }

        return RecommendationResultDto.builder()
                .idLigne(idLigne)
                .idArret(selectedArret.getIdArret())
                .idStagiaire(idStagiaire)
                .nomLigne(ligneArret.getLigne().getNomLigne())
                .nomArret(selectedArret.getNomArret())
                .distance(nearestDistance)
                .latitudeArret(selectedArret.getLatitude())
                .longitudeArret(selectedArret.getLongitude())
                .stops(stops)
                .build();
    }

    private Stagiaire findStagiaireById(Integer idStagiaire) {
        return stagiaireRepository.findById(idStagiaire)
                .orElseThrow(() -> new ResourceNotFoundException("Stagiaire introuvable avec l'id : " + idStagiaire));
    }

    private Stagiaire findStagiaireByEmail(String email) {
        if (email == null || email.isBlank()) {
            return null;
        }

        return stagiaireRepository.findByUtilisateur_EmailIgnoreCase(email).orElse(null);
    }

    private void validateStagiaireCoordinates(Stagiaire stagiaire) {
        if (stagiaire.getLatitude() == null || stagiaire.getLongitude() == null) {
            throw new IllegalArgumentException("Les coordonnees GPS du stagiaire sont obligatoires");
        }
    }

    private void validatePositionRequest(PositionRequestDto request) {
        if (request == null || request.getLatitude() == null || request.getLongitude() == null) {
            throw new IllegalArgumentException("La latitude et la longitude sont obligatoires");
        }
    }

    private RecommendationStopDto toRecommendationStopDto(LigneArret ligneArret) {
        Arret arret = ligneArret.getArret();

        return RecommendationStopDto.builder()
                .idArret(arret.getIdArret())
                .nomArret(arret.getNomArret())
                .latitude(arret.getLatitude())
                .longitude(arret.getLongitude())
                .adresse(arret.getAdresse())
                .ordre(ligneArret.getOrdre())
                .build();
    }

    private void saveRecommendation(
            Stagiaire stagiaire,
            LigneArret ligneArret,
            Arret arret,
            double distance) {
        RecommendationTrajet recommendationTrajet = RecommendationTrajet.builder()
                .stagiaire(stagiaire)
                .ligne(ligneArret.getLigne())
                .arret(arret)
                .distance(distance)
                .dateRecherche(LocalDateTime.now())
                .build();

        recommendationTrajetRepository.save(recommendationTrajet);
    }

    private double calculateDistanceInKilometers(
            double startLatitude,
            double startLongitude,
            double endLatitude,
            double endLongitude) {
        double latitudeDistance = Math.toRadians(endLatitude - startLatitude);
        double longitudeDistance = Math.toRadians(endLongitude - startLongitude);

        double startLatitudeRadians = Math.toRadians(startLatitude);
        double endLatitudeRadians = Math.toRadians(endLatitude);

        double a = Math.sin(latitudeDistance / 2) * Math.sin(latitudeDistance / 2)
                + Math.cos(startLatitudeRadians) * Math.cos(endLatitudeRadians)
                * Math.sin(longitudeDistance / 2) * Math.sin(longitudeDistance / 2);
        double normalizedA = Math.min(1.0, a);
        double c = 2 * Math.atan2(Math.sqrt(normalizedA), Math.sqrt(1 - normalizedA));

        return EARTH_RADIUS_KM * c;
    }
}
