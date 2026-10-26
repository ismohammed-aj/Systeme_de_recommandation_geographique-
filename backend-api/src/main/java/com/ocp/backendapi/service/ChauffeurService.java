package com.ocp.backendapi.service;

import com.ocp.backendapi.dto.ChauffeurDto;
import java.util.List;

public interface ChauffeurService {
    ChauffeurDto createChauffeur(ChauffeurDto chauffeurDto);

    List<ChauffeurDto> getAllChauffeurs();

    ChauffeurDto getChauffeurById(Integer id);

    ChauffeurDto updateChauffeur(Integer id, ChauffeurDto chauffeurDto);

    void deleteChauffeur(Integer id);
}
