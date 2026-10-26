package com.ocp.backendapi.mapper;

import com.ocp.backendapi.dto.StagiaireDto;
import com.ocp.backendapi.dto.StagiairePositionDto;
import com.ocp.backendapi.entity.Stagiaire;
import com.ocp.backendapi.entity.Utilisateur;
import org.springframework.stereotype.Component;

@Component
public class StagiaireMapper {
    public StagiaireDto toDto(Stagiaire stagiaire) {
        if (stagiaire == null) {
            return null;
        }

        Integer idUtilisateur = stagiaire.getUtilisateur() == null
                ? null
                : stagiaire.getUtilisateur().getIdUtilisateur();

        return StagiaireDto.builder()
                .idStagiaire(stagiaire.getIdStagiaire())
                .idUtilisateur(idUtilisateur)
                .telephone(stagiaire.getTelephone())
                .adresse(stagiaire.getAdresse())
                .villeOrigine(stagiaire.getVilleOrigine())
                .latitude(stagiaire.getLatitude())
                .longitude(stagiaire.getLongitude())
                .positionShared(stagiaire.getPositionShared())
                .lastPositionUpdate(stagiaire.getLastPositionUpdate())
                .build();
    }

    public StagiairePositionDto toPositionDto(Stagiaire stagiaire) {
        if (stagiaire == null) {
            return null;
        }

        Utilisateur utilisateur = stagiaire.getUtilisateur();

        return StagiairePositionDto.builder()
                .idStagiaire(stagiaire.getIdStagiaire())
                .idUtilisateur(utilisateur == null ? null : utilisateur.getIdUtilisateur())
                .nom(utilisateur == null ? null : utilisateur.getNom())
                .prenom(utilisateur == null ? null : utilisateur.getPrenom())
                .email(utilisateur == null ? null : utilisateur.getEmail())
                .latitude(stagiaire.getLatitude())
                .longitude(stagiaire.getLongitude())
                .positionShared(stagiaire.getPositionShared())
                .lastPositionUpdate(stagiaire.getLastPositionUpdate())
                .build();
    }

    public Stagiaire toEntity(StagiaireDto stagiaireDto, Utilisateur utilisateur) {
        if (stagiaireDto == null) {
            return null;
        }

        return Stagiaire.builder()
                .idStagiaire(stagiaireDto.getIdStagiaire())
                .utilisateur(utilisateur)
                .telephone(stagiaireDto.getTelephone())
                .adresse(stagiaireDto.getAdresse())
                .villeOrigine(stagiaireDto.getVilleOrigine())
                .latitude(stagiaireDto.getLatitude())
                .longitude(stagiaireDto.getLongitude())
                .positionShared(stagiaireDto.getPositionShared())
                .lastPositionUpdate(stagiaireDto.getLastPositionUpdate())
                .build();
    }

    public void updateEntityFromDto(StagiaireDto stagiaireDto, Stagiaire stagiaire, Utilisateur utilisateur) {
        stagiaire.setUtilisateur(utilisateur);
        stagiaire.setTelephone(stagiaireDto.getTelephone());
        stagiaire.setAdresse(stagiaireDto.getAdresse());
        stagiaire.setVilleOrigine(stagiaireDto.getVilleOrigine());
        stagiaire.setLatitude(stagiaireDto.getLatitude());
        stagiaire.setLongitude(stagiaireDto.getLongitude());

        if (stagiaireDto.getPositionShared() != null) {
            stagiaire.setPositionShared(stagiaireDto.getPositionShared());
        }

        if (stagiaireDto.getLastPositionUpdate() != null) {
            stagiaire.setLastPositionUpdate(stagiaireDto.getLastPositionUpdate());
        }
    }
}
