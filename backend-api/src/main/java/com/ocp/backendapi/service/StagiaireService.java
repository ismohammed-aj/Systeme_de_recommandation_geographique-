package com.ocp.backendapi.service;

import com.ocp.backendapi.dto.PositionRequestDto;
import com.ocp.backendapi.dto.StagiaireDto;
import com.ocp.backendapi.dto.StagiairePositionDto;
import java.util.List;

public interface StagiaireService {
    StagiaireDto createStagiaire(StagiaireDto stagiaireDto);

    List<StagiaireDto> getAllStagiaires();

    StagiaireDto getStagiaireById(Integer id);

    StagiaireDto updateStagiaire(Integer id, StagiaireDto stagiaireDto);

    void deleteStagiaire(Integer id);

    List<StagiairePositionDto> getSharedStagiairePositions();

    StagiaireDto updateCurrentStagiairePosition(String email, PositionRequestDto positionRequestDto);
}
