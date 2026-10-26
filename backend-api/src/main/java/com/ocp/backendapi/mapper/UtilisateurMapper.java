package com.ocp.backendapi.mapper;

import com.ocp.backendapi.dto.UtilisateurDto;
import com.ocp.backendapi.entity.Utilisateur;
import org.springframework.stereotype.Component;

@Component
public class UtilisateurMapper {
    public UtilisateurDto toDto(Utilisateur utilisateur) {
        if (utilisateur == null) {
            return null;
        }

        return UtilisateurDto.builder()
                .idUtilisateur(utilisateur.getIdUtilisateur())
                .nom(utilisateur.getNom())
                .prenom(utilisateur.getPrenom())
                .email(utilisateur.getEmail())
                .motDePasse(utilisateur.getMotDePasse())
                .role(utilisateur.getRole())
                .build();
    }

    public Utilisateur toEntity(UtilisateurDto utilisateurDto) {
        if (utilisateurDto == null) {
            return null;
        }

        return Utilisateur.builder()
                .idUtilisateur(utilisateurDto.getIdUtilisateur())
                .nom(utilisateurDto.getNom())
                .prenom(utilisateurDto.getPrenom())
                .email(utilisateurDto.getEmail())
                .motDePasse(utilisateurDto.getMotDePasse())
                .role(utilisateurDto.getRole())
                .build();
    }

    public void updateEntityFromDto(UtilisateurDto utilisateurDto, Utilisateur utilisateur) {
        utilisateur.setNom(utilisateurDto.getNom());
        utilisateur.setPrenom(utilisateurDto.getPrenom());
        utilisateur.setEmail(utilisateurDto.getEmail());
        utilisateur.setMotDePasse(utilisateurDto.getMotDePasse());
        utilisateur.setRole(utilisateurDto.getRole());
    }
}
