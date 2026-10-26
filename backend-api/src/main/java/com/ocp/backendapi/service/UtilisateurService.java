package com.ocp.backendapi.service;

import com.ocp.backendapi.dto.UtilisateurDto;
import java.util.List;

public interface UtilisateurService {
    UtilisateurDto createUtilisateur(UtilisateurDto utilisateurDto);

    List<UtilisateurDto> getAllUtilisateurs();

    UtilisateurDto getUtilisateurById(Integer id);

    UtilisateurDto updateUtilisateur(Integer id, UtilisateurDto utilisateurDto);

    void deleteUtilisateur(Integer id);
}
