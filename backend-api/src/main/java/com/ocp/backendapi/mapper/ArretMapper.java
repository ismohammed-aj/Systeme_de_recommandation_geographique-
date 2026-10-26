package com.ocp.backendapi.mapper;

import com.ocp.backendapi.dto.ArretDto;
import com.ocp.backendapi.entity.Arret;
import org.springframework.stereotype.Component;

@Component
public class ArretMapper {
    public ArretDto toDto(Arret arret) {
        if (arret == null) {
            return null;
        }

        return ArretDto.builder()
                .idArret(arret.getIdArret())
                .nomArret(arret.getNomArret())
                .latitude(arret.getLatitude())
                .longitude(arret.getLongitude())
                .adresse(arret.getAdresse())
                .build();
    }

    public Arret toEntity(ArretDto arretDto) {
        if (arretDto == null) {
            return null;
        }

        return Arret.builder()
                .idArret(arretDto.getIdArret())
                .nomArret(arretDto.getNomArret())
                .latitude(arretDto.getLatitude())
                .longitude(arretDto.getLongitude())
                .adresse(arretDto.getAdresse())
                .build();
    }

    public void updateEntityFromDto(ArretDto arretDto, Arret arret) {
        arret.setNomArret(arretDto.getNomArret());
        arret.setLatitude(arretDto.getLatitude());
        arret.setLongitude(arretDto.getLongitude());
        arret.setAdresse(arretDto.getAdresse());
    }
}
