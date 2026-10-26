package com.ocp.backendapi.mapper;

import com.ocp.backendapi.dto.LigneDto;
import com.ocp.backendapi.entity.Bus;
import com.ocp.backendapi.entity.Chauffeur;
import com.ocp.backendapi.entity.Ligne;
import org.springframework.stereotype.Component;

@Component
public class LigneMapper {
    public LigneDto toDto(Ligne ligne) {
        if (ligne == null) {
            return null;
        }

        Integer idBus = ligne.getBus() == null ? null : ligne.getBus().getIdBus();
        Integer idChauffeur = ligne.getChauffeur() == null ? null : ligne.getChauffeur().getIdChauffeur();

        return LigneDto.builder()
                .idLigne(ligne.getIdLigne())
                .nomLigne(ligne.getNomLigne())
                .description(ligne.getDescription())
                .idBus(idBus)
                .idChauffeur(idChauffeur)
                .build();
    }

    public Ligne toEntity(LigneDto ligneDto, Bus bus, Chauffeur chauffeur) {
        if (ligneDto == null) {
            return null;
        }

        return Ligne.builder()
                .idLigne(ligneDto.getIdLigne())
                .nomLigne(ligneDto.getNomLigne())
                .description(ligneDto.getDescription())
                .bus(bus)
                .chauffeur(chauffeur)
                .build();
    }

    public void updateEntityFromDto(LigneDto ligneDto, Ligne ligne, Bus bus, Chauffeur chauffeur) {
        ligne.setNomLigne(ligneDto.getNomLigne());
        ligne.setDescription(ligneDto.getDescription());
        ligne.setBus(bus);
        ligne.setChauffeur(chauffeur);
    }
}
