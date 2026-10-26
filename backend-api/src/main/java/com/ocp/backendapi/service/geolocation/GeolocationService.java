package com.ocp.backendapi.service.geolocation;

import com.ocp.backendapi.dto.PositionRequestDto;
import com.ocp.backendapi.dto.RecommendationResultDto;

public interface GeolocationService {
    RecommendationResultDto findBestLineForStagiaire(Integer idStagiaire);

    RecommendationResultDto findBestLineByPosition(PositionRequestDto request);

    RecommendationResultDto findBestLineByPosition(String email, PositionRequestDto request);
}
