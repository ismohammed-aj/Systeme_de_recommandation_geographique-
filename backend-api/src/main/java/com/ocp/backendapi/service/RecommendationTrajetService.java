package com.ocp.backendapi.service;

import com.ocp.backendapi.dto.RecommendationTrajetDto;
import java.util.List;

public interface RecommendationTrajetService {
    RecommendationTrajetDto createRecommendation(RecommendationTrajetDto recommendationTrajetDto);

    List<RecommendationTrajetDto> getAllRecommendations();

    RecommendationTrajetDto getRecommendationById(Integer id);

    RecommendationTrajetDto updateRecommendation(Integer id, RecommendationTrajetDto recommendationTrajetDto);

    void deleteRecommendation(Integer id);

    List<RecommendationTrajetDto> getRecommendationsByStagiaireId(Integer idStagiaire);
}
