package com.ocp.backendapi.service.impl;

import com.ocp.backendapi.dto.PositionRequestDto;
import com.ocp.backendapi.dto.StagiaireDto;
import com.ocp.backendapi.dto.StagiairePositionDto;
import com.ocp.backendapi.entity.Stagiaire;
import com.ocp.backendapi.entity.Utilisateur;
import com.ocp.backendapi.exception.ResourceNotFoundException;
import com.ocp.backendapi.mapper.StagiaireMapper;
import com.ocp.backendapi.repository.StagiaireRepository;
import com.ocp.backendapi.repository.UtilisateurRepository;
import com.ocp.backendapi.service.StagiaireService;
import java.time.LocalDateTime;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class StagiaireServiceImpl implements StagiaireService {
    private final StagiaireRepository stagiaireRepository;
    private final UtilisateurRepository utilisateurRepository;
    private final StagiaireMapper stagiaireMapper;

    @Override
    public StagiaireDto createStagiaire(StagiaireDto stagiaireDto) {
        Utilisateur utilisateur = findUtilisateurById(stagiaireDto.getIdUtilisateur());

        if (stagiaireRepository.existsByUtilisateur_IdUtilisateur(utilisateur.getIdUtilisateur())) {
            throw new IllegalArgumentException("Un stagiaire existe deja pour cet utilisateur");
        }

        Stagiaire stagiaire = stagiaireMapper.toEntity(stagiaireDto, utilisateur);
        stagiaire.setIdStagiaire(null);
        applyPositionDefaults(stagiaire);

        return stagiaireMapper.toDto(stagiaireRepository.save(stagiaire));
    }

    @Override
    @Transactional(readOnly = true)
    public List<StagiaireDto> getAllStagiaires() {
        return stagiaireRepository.findAll()
                .stream()
                .map(stagiaireMapper::toDto)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public StagiaireDto getStagiaireById(Integer id) {
        return stagiaireMapper.toDto(findStagiaireById(id));
    }

    @Override
    public StagiaireDto updateStagiaire(Integer id, StagiaireDto stagiaireDto) {
        Stagiaire stagiaire = findStagiaireById(id);
        Utilisateur utilisateur = findUtilisateurById(stagiaireDto.getIdUtilisateur());
        Integer currentUtilisateurId = stagiaire.getUtilisateur().getIdUtilisateur();

        if (!currentUtilisateurId.equals(utilisateur.getIdUtilisateur())
                && stagiaireRepository.existsByUtilisateur_IdUtilisateur(utilisateur.getIdUtilisateur())) {
            throw new IllegalArgumentException("Un stagiaire existe deja pour cet utilisateur");
        }

        stagiaireMapper.updateEntityFromDto(stagiaireDto, stagiaire, utilisateur);
        applyPositionDefaults(stagiaire);

        return stagiaireMapper.toDto(stagiaireRepository.save(stagiaire));
    }

    @Override
    public void deleteStagiaire(Integer id) {
        Stagiaire stagiaire = findStagiaireById(id);
        stagiaireRepository.delete(stagiaire);
    }

    @Override
    @Transactional(readOnly = true)
    public List<StagiairePositionDto> getSharedStagiairePositions() {
        return stagiaireRepository.findByPositionSharedTrueAndLatitudeIsNotNullAndLongitudeIsNotNull()
                .stream()
                .map(stagiaireMapper::toPositionDto)
                .toList();
    }

    @Override
    public StagiaireDto updateCurrentStagiairePosition(String email, PositionRequestDto positionRequestDto) {
        if (positionRequestDto == null
                || positionRequestDto.getLatitude() == null
                || positionRequestDto.getLongitude() == null) {
            throw new IllegalArgumentException("La latitude et la longitude sont obligatoires");
        }
        validateCoordinates(positionRequestDto);

        Utilisateur utilisateur = utilisateurRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur introuvable"));
        Stagiaire stagiaire = stagiaireRepository.findByUtilisateur_EmailIgnoreCase(email)
                .orElseGet(() -> Stagiaire.builder()
                        .utilisateur(utilisateur)
                        .positionShared(false)
                        .build());

        stagiaire.setLatitude(positionRequestDto.getLatitude());
        stagiaire.setLongitude(positionRequestDto.getLongitude());
        stagiaire.setPositionShared(true);
        stagiaire.setLastPositionUpdate(LocalDateTime.now());

        return stagiaireMapper.toDto(stagiaireRepository.save(stagiaire));
    }

    private Stagiaire findStagiaireById(Integer id) {
        return stagiaireRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Stagiaire introuvable avec l'id : " + id));
    }

    private Utilisateur findUtilisateurById(Integer id) {
        return utilisateurRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur introuvable avec l'id : " + id));
    }

    private void applyPositionDefaults(Stagiaire stagiaire) {
        if (stagiaire.getPositionShared() == null) {
            stagiaire.setPositionShared(false);
        }
    }

    private void validateCoordinates(PositionRequestDto positionRequestDto) {
        Double latitude = positionRequestDto.getLatitude();
        Double longitude = positionRequestDto.getLongitude();

        if (latitude < -90 || latitude > 90) {
            throw new IllegalArgumentException("La latitude doit etre entre -90 et 90");
        }

        if (longitude < -180 || longitude > 180) {
            throw new IllegalArgumentException("La longitude doit etre entre -180 et 180");
        }
    }
}
