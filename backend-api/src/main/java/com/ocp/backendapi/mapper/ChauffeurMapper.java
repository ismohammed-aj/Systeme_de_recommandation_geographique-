package com.ocp.backendapi.mapper;

import com.ocp.backendapi.dto.ChauffeurDto;
import com.ocp.backendapi.entity.Chauffeur;
import org.springframework.stereotype.Component;

@Component
public class ChauffeurMapper {
    public ChauffeurDto toDto(Chauffeur chauffeur) {
        if (chauffeur == null) {
            return null;
        }

        return ChauffeurDto.builder()
                .idChauffeur(chauffeur.getIdChauffeur())
                .nom(chauffeur.getNom())
                .prenom(chauffeur.getPrenom())
                .telephone(chauffeur.getTelephone())
                .numeroPermis(chauffeur.getNumeroPermis())
                .build();
    }

    public Chauffeur toEntity(ChauffeurDto chauffeurDto) {
        if (chauffeurDto == null) {
            return null;
        }

        return Chauffeur.builder()
                .idChauffeur(chauffeurDto.getIdChauffeur())
                .nom(chauffeurDto.getNom())
                .prenom(chauffeurDto.getPrenom())
                .telephone(chauffeurDto.getTelephone())
                .numeroPermis(chauffeurDto.getNumeroPermis())
                .build();
    }

    public void updateEntityFromDto(ChauffeurDto chauffeurDto, Chauffeur chauffeur) {
        chauffeur.setNom(chauffeurDto.getNom());
        chauffeur.setPrenom(chauffeurDto.getPrenom());
        chauffeur.setTelephone(chauffeurDto.getTelephone());
        chauffeur.setNumeroPermis(chauffeurDto.getNumeroPermis());
    }
}
