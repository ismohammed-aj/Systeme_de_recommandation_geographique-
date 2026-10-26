package com.ocp.backendapi.service;

import com.ocp.backendapi.dto.LigneDto;
import com.ocp.backendapi.dto.LigneWithArretsDto;
import com.ocp.backendapi.dto.RecommendationStopDto;
import java.util.List;

public interface LigneService {
    LigneDto createLigne(LigneDto ligneDto);

    List<LigneDto> getAllLignes();

    LigneDto getLigneById(Integer id);

    LigneDto updateLigne(Integer id, LigneDto ligneDto);

    void deleteLigne(Integer id);

    List<RecommendationStopDto> getArretsByLigneId(Integer idLigne);

    List<LigneWithArretsDto> getAllLignesWithArrets();
}
