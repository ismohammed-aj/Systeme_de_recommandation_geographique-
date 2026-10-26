package com.ocp.backendapi.service.impl;

import com.ocp.backendapi.dto.BusDto;
import com.ocp.backendapi.entity.Bus;
import com.ocp.backendapi.exception.ResourceNotFoundException;
import com.ocp.backendapi.mapper.BusMapper;
import com.ocp.backendapi.repository.BusRepository;
import com.ocp.backendapi.service.BusService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class BusServiceImpl implements BusService {
    private final BusRepository busRepository;
    private final BusMapper busMapper;

    @Override
    public BusDto createBus(BusDto busDto) {
        if (busRepository.existsByMatricule(busDto.getMatricule())) {
            throw new IllegalArgumentException("Un bus avec ce matricule existe deja");
        }

        Bus bus = busMapper.toEntity(busDto);
        bus.setIdBus(null);

        return busMapper.toDto(busRepository.save(bus));
    }

    @Override
    @Transactional(readOnly = true)
    public List<BusDto> getAllBus() {
        return busRepository.findAll()
                .stream()
                .map(busMapper::toDto)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public BusDto getBusById(Integer id) {
        return busMapper.toDto(findBusById(id));
    }

    @Override
    public BusDto updateBus(Integer id, BusDto busDto) {
        Bus bus = findBusById(id);

        if (!bus.getMatricule().equals(busDto.getMatricule())
                && busRepository.existsByMatricule(busDto.getMatricule())) {
            throw new IllegalArgumentException("Un bus avec ce matricule existe deja");
        }

        busMapper.updateEntityFromDto(busDto, bus);

        return busMapper.toDto(busRepository.save(bus));
    }

    @Override
    public void deleteBus(Integer id) {
        Bus bus = findBusById(id);
        busRepository.delete(bus);
    }

    private Bus findBusById(Integer id) {
        return busRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Bus introuvable avec l'id : " + id));
    }
}
