package com.ocp.backendapi.service.impl;

import com.ocp.backendapi.dto.LigneArretDto;
import com.ocp.backendapi.entity.Arret;
import com.ocp.backendapi.entity.Ligne;
import com.ocp.backendapi.entity.LigneArret;
import com.ocp.backendapi.exception.ResourceNotFoundException;
import com.ocp.backendapi.mapper.LigneArretMapper;
import com.ocp.backendapi.repository.ArretRepository;
import com.ocp.backendapi.repository.LigneArretRepository;
import com.ocp.backendapi.repository.LigneRepository;
import com.ocp.backendapi.service.LigneArretService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class LigneArretServiceImpl implements LigneArretService {
    private final LigneArretRepository ligneArretRepository;
    private final LigneRepository ligneRepository;
    private final ArretRepository arretRepository;
    private final LigneArretMapper ligneArretMapper;

    @Override
    public LigneArretDto createLigneArret(LigneArretDto ligneArretDto) {
        Ligne ligne = findLigneById(ligneArretDto.getIdLigne());
        Arret arret = findArretById(ligneArretDto.getIdArret());

        LigneArret ligneArret = ligneArretMapper.toEntity(ligneArretDto, ligne, arret);
        ligneArret.setIdLigneArret(null);

        return ligneArretMapper.toDto(ligneArretRepository.save(ligneArret));
    }

    @Override
    @Transactional(readOnly = true)
    public List<LigneArretDto> getAllLigneArrets() {
        return ligneArretRepository.findAll()
                .stream()
                .map(ligneArretMapper::toDto)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public LigneArretDto getLigneArretById(Integer id) {
        return ligneArretMapper.toDto(findLigneArretById(id));
    }

    @Override
    public LigneArretDto updateLigneArret(Integer id, LigneArretDto ligneArretDto) {
        LigneArret ligneArret = findLigneArretById(id);
        Ligne ligne = findLigneById(ligneArretDto.getIdLigne());
        Arret arret = findArretById(ligneArretDto.getIdArret());

        ligneArretMapper.updateEntityFromDto(ligneArretDto, ligneArret, ligne, arret);

        return ligneArretMapper.toDto(ligneArretRepository.save(ligneArret));
    }

    @Override
    public void deleteLigneArret(Integer id) {
        LigneArret ligneArret = findLigneArretById(id);
        ligneArretRepository.delete(ligneArret);
    }

    @Override
    @Transactional(readOnly = true)
    public List<LigneArretDto> getLigneArretsByLigneId(Integer idLigne) {
        findLigneById(idLigne);

        return ligneArretRepository.findAssociationsByLigneIdOrderByOrdreAsc(idLigne)
                .stream()
                .map(ligneArretMapper::toDto)
                .toList();
    }

    private LigneArret findLigneArretById(Integer id) {
        return ligneArretRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ligne-arret introuvable avec l'id : " + id));
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
