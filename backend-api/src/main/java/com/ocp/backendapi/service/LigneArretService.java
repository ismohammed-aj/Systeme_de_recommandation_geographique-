package com.ocp.backendapi.service;

import com.ocp.backendapi.dto.LigneArretDto;
import java.util.List;

public interface LigneArretService {
    LigneArretDto createLigneArret(LigneArretDto ligneArretDto);

    List<LigneArretDto> getAllLigneArrets();

    LigneArretDto getLigneArretById(Integer id);

    LigneArretDto updateLigneArret(Integer id, LigneArretDto ligneArretDto);

    void deleteLigneArret(Integer id);

    List<LigneArretDto> getLigneArretsByLigneId(Integer idLigne);
}
