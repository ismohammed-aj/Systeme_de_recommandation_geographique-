package com.ocp.backendapi.service.impl;

import com.ocp.backendapi.dto.RecommendationTrajetDto;
import com.ocp.backendapi.entity.Arret;
import com.ocp.backendapi.entity.Ligne;
import com.ocp.backendapi.entity.RecommendationTrajet;
import com.ocp.backendapi.entity.Stagiaire;
import com.ocp.backendapi.exception.ResourceNotFoundException;
import com.ocp.backendapi.mapper.RecommendationTrajetMapper;
import com.ocp.backendapi.repository.ArretRepository;
import com.ocp.backendapi.repository.LigneRepository;
import com.ocp.backendapi.repository.RecommendationTrajetRepository;
import com.ocp.backendapi.repository.StagiaireRepository;
import com.ocp.backendapi.service.RecommendationTrajetService;
import java.time.LocalDateTime;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class RecommendationTrajetServiceImpl implements RecommendationTrajetService {
    private final RecommendationTrajetRepository recommendationTrajetRepository;
    private final StagiaireRepository stagiaireRepository;
    private final LigneRepository ligneRepository;
    private final ArretRepository arretRepository;
    private final RecommendationTrajetMapper recommendationTrajetMapper;

    @Override
    public RecommendationTrajetDto createRecommendation(RecommendationTrajetDto recommendationTrajetDto) {
        Stagiaire stagiaire = findStagiaireById(recommendationTrajetDto.getIdStagiaire());
        Ligne ligne = findLigneById(recommendationTrajetDto.getIdLigne());
        Arret arret = findArretById(recommendationTrajetDto.getIdArret());

        RecommendationTrajet recommendationTrajet = recommendationTrajetMapper.toEntity(
                recommendationTrajetDto,
                stagiaire,
                ligne,
                arret);
        recommendationTrajet.setIdRecommandation(null);

        if (recommendationTrajet.getDateRecherche() == null) {
            recommendationTrajet.setDateRecherche(LocalDateTime.now());
        }

        return recommendationTrajetMapper.toDto(recommendationTrajetRepository.save(recommendationTrajet));
    }

    @Override
    @Transactional(readOnly = true)
    public List<RecommendationTrajetDto> getAllRecommendations() {
        return recommendationTrajetRepository.findAll()
                .stream()
                .map(recommendationTrajetMapper::toDto)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public RecommendationTrajetDto getRecommendationById(Integer id) {
        return recommendationTrajetMapper.toDto(findRecommendationTrajetById(id));
    }

    @Override
    public RecommendationTrajetDto updateRecommendation(
            Integer id,
            RecommendationTrajetDto recommendationTrajetDto) {
        RecommendationTrajet recommendationTrajet = findRecommendationTrajetById(id);
        LocalDateTime existingDateRecherche = recommendationTrajet.getDateRecherche();
        Stagiaire stagiaire = findStagiaireById(recommendationTrajetDto.getIdStagiaire());
        Ligne ligne = findLigneById(recommendationTrajetDto.getIdLigne());
        Arret arret = findArretById(recommendationTrajetDto.getIdArret());

        recommendationTrajetMapper.updateEntityFromDto(
                recommendationTrajetDto,
                recommendationTrajet,
                stagiaire,
                ligne,
                arret);

        if (recommendationTrajet.getDateRecherche() == null) {
            recommendationTrajet.setDateRecherche(existingDateRecherche == null ? LocalDateTime.now() : existingDateRecherche);
        }

        return recommendationTrajetMapper.toDto(recommendationTrajetRepository.save(recommendationTrajet));
    }

    @Override
    public void deleteRecommendation(Integer id) {
        RecommendationTrajet recommendationTrajet = findRecommendationTrajetById(id);
        recommendationTrajetRepository.delete(recommendationTrajet);
    }

    @Override
    @Transactional(readOnly = true)
    public List<RecommendationTrajetDto> getRecommendationsByStagiaireId(Integer idStagiaire) {
        findStagiaireById(idStagiaire);

        return recommendationTrajetRepository.findByStagiaire_IdStagiaireOrderByDateRechercheDesc(idStagiaire)
                .stream()
                .map(recommendationTrajetMapper::toDto)
                .toList();
    }

    private RecommendationTrajet findRecommendationTrajetById(Integer id) {
        return recommendationTrajetRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Recommendation introuvable avec l'id : " + id));
    }

    private Stagiaire findStagiaireById(Integer id) {
        return stagiaireRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Stagiaire introuvable avec l'id : " + id));
    }

    private Ligne findLigneById(Integer id) {
        return ligneRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ligne introuvable avec l'id : " + id));
    }

    private Arret findArretById(Integer id) {
        return arretRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Arret introuvable avec l'id : " + id));
    }
}
