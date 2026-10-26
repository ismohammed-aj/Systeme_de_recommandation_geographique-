package com.ocp.backendapi.mapper;

import com.ocp.backendapi.dto.BusDto;
import com.ocp.backendapi.entity.Bus;
import org.springframework.stereotype.Component;

@Component
public class BusMapper {
    public BusDto toDto(Bus bus) {
        if (bus == null) {
            return null;
        }

        return BusDto.builder()
                .idBus(bus.getIdBus())
                .matricule(bus.getMatricule())
                .capacite(bus.getCapacite())
                .statut(bus.getStatut())
                .build();
    }

    public Bus toEntity(BusDto busDto) {
        if (busDto == null) {
            return null;
        }

        return Bus.builder()
                .idBus(busDto.getIdBus())
                .matricule(busDto.getMatricule())
                .capacite(busDto.getCapacite())
                .statut(busDto.getStatut())
                .build();
    }

    public void updateEntityFromDto(BusDto busDto, Bus bus) {
        bus.setMatricule(busDto.getMatricule());
        bus.setCapacite(busDto.getCapacite());
        bus.setStatut(busDto.getStatut());
    }
}
