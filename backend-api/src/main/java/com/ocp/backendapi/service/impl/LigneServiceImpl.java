package com.ocp.backendapi.service.impl;

import com.ocp.backendapi.dto.LigneDto;
import com.ocp.backendapi.dto.LigneWithArretsDto;
import com.ocp.backendapi.dto.RecommendationStopDto;
import com.ocp.backendapi.entity.Arret;
import com.ocp.backendapi.entity.Bus;
import com.ocp.backendapi.entity.Chauffeur;
import com.ocp.backendapi.entity.Ligne;
import com.ocp.backendapi.entity.LigneArret;
import com.ocp.backendapi.exception.ResourceNotFoundException;
import com.ocp.backendapi.mapper.LigneMapper;
import com.ocp.backendapi.repository.BusRepository;
import com.ocp.backendapi.repository.ChauffeurRepository;
import com.ocp.backendapi.repository.LigneArretRepository;
import com.ocp.backendapi.repository.LigneRepository;
import com.ocp.backendapi.service.LigneService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class LigneServiceImpl implements LigneService {
    private final LigneRepository ligneRepository;
    private final BusRepository busRepository;
    private final ChauffeurRepository chauffeurRepository;
    private final LigneArretRepository ligneArretRepository;
    private final LigneMapper ligneMapper;

    @Override
    public LigneDto createLigne(LigneDto ligneDto) {
        Bus bus = findBusByIdIfProvided(ligneDto.getIdBus());
        Chauffeur chauffeur = findChauffeurByIdIfProvided(ligneDto.getIdChauffeur());

        Ligne ligne = ligneMapper.toEntity(ligneDto, bus, chauffeur);
        ligne.setIdLigne(null);

        return ligneMapper.toDto(ligneRepository.save(ligne));
    }

    @Override
    @Transactional(readOnly = true)
    public List<LigneDto> getAllLignes() {
        return ligneRepository.findAll()
                .stream()
                .map(ligneMapper::toDto)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public LigneDto getLigneById(Integer id) {
        return ligneMapper.toDto(findLigneById(id));
    }

    @Override
    public LigneDto updateLigne(Integer id, LigneDto ligneDto) {
        Ligne ligne = findLigneById(id);
        Bus bus = findBusByIdIfProvided(ligneDto.getIdBus());
        Chauffeur chauffeur = findChauffeurByIdIfProvided(ligneDto.getIdChauffeur());

        ligneMapper.updateEntityFromDto(ligneDto, ligne, bus, chauffeur);

        return ligneMapper.toDto(ligneRepository.save(ligne));
    }

    @Override
    public void deleteLigne(Integer id) {
        Ligne ligne = findLigneById(id);
        ligneRepository.delete(ligne);
    }

    @Override
    @Transactional(readOnly = true)
    public List<RecommendationStopDto> getArretsByLigneId(Integer idLigne) {
        findLigneById(idLigne);

        return ligneArretRepository.findAssociationsByLigneIdOrderByOrdreAsc(idLigne)
                .stream()
                .map(this::toRecommendationStopDto)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<LigneWithArretsDto> getAllLignesWithArrets() {
        return ligneRepository.findAll()
                .stream()
                .map(this::toLigneWithArretsDto)
                .toList();
    }

    private Ligne findLigneById(Integer id) {
        return ligneRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ligne introuvable avec l'id : " + id));
    }

    private Bus findBusByIdIfProvided(Integer id) {
        if (id == null) {
            return null;
        }

        return busRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Bus introuvable avec l'id : " + id));
    }

    private Chauffeur findChauffeurByIdIfProvided(Integer id) {
        if (id == null) {
            return null;
        }

        return chauffeurRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Chauffeur introuvable avec l'id : " + id));
    }

    private LigneWithArretsDto toLigneWithArretsDto(Ligne ligne) {
        Integer idBus = ligne.getBus() == null ? null : ligne.getBus().getIdBus();
        Integer idChauffeur = ligne.getChauffeur() == null ? null : ligne.getChauffeur().getIdChauffeur();

        return LigneWithArretsDto.builder()
                .idLigne(ligne.getIdLigne())
                .nomLigne(ligne.getNomLigne())
                .description(ligne.getDescription())
                .idBus(idBus)
                .idChauffeur(idChauffeur)
                .stops(getArretsByLigneId(ligne.getIdLigne()))
                .build();
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
}
