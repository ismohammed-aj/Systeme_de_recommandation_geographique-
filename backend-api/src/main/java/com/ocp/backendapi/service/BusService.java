package com.ocp.backendapi.service;

import com.ocp.backendapi.dto.BusDto;
import java.util.List;

public interface BusService {
    BusDto createBus(BusDto busDto);

    List<BusDto> getAllBus();

    BusDto getBusById(Integer id);

    BusDto updateBus(Integer id, BusDto busDto);

    void deleteBus(Integer id);
}
