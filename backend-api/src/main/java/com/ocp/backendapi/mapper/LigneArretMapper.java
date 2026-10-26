package com.ocp.backendapi.mapper;

import com.ocp.backendapi.dto.LigneArretDto;
import com.ocp.backendapi.entity.Arret;
import com.ocp.backendapi.entity.Ligne;
import com.ocp.backendapi.entity.LigneArret;
import org.springframework.stereotype.Component;

@Component
public class LigneArretMapper {
    public LigneArretDto toDto(LigneArret ligneArret) {
        if (ligneArret == null) {
            return null;
        }

        Integer idLigne = ligneArret.getLigne() == null ? null : ligneArret.getLigne().getIdLigne();
        Integer idArret = ligneArret.getArret() == null ? null : ligneArret.getArret().getIdArret();

        return LigneArretDto.builder()
                .idLigneArret(ligneArret.getIdLigneArret())
                .idLigne(idLigne)
                .idArret(idArret)
                .ordre(ligneArret.getOrdre())
                .build();
    }

    public LigneArret toEntity(LigneArretDto ligneArretDto, Ligne ligne, Arret arret) {
        if (ligneArretDto == null) {
            return null;
        }

        return LigneArret.builder()
                .idLigneArret(ligneArretDto.getIdLigneArret())
                .ligne(ligne)
                .arret(arret)
                .ordre(ligneArretDto.getOrdre())
                .build();
    }

    public void updateEntityFromDto(
            LigneArretDto ligneArretDto,
            LigneArret ligneArret,
            Ligne ligne,
            Arret arret) {
        ligneArret.setLigne(ligne);
        ligneArret.setArret(arret);
        ligneArret.setOrdre(ligneArretDto.getOrdre());
    }
}
