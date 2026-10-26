package com.ocp.backendapi.service.impl;

import com.ocp.backendapi.dto.ArretDto;
import com.ocp.backendapi.entity.Arret;
import com.ocp.backendapi.exception.ResourceNotFoundException;
import com.ocp.backendapi.mapper.ArretMapper;
import com.ocp.backendapi.repository.ArretRepository;
import com.ocp.backendapi.service.ArretService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class ArretServiceImpl implements ArretService {
    private final ArretRepository arretRepository;
    private final ArretMapper arretMapper;

    @Override
    public ArretDto createArret(ArretDto arretDto) {
        Arret arret = arretMapper.toEntity(arretDto);
        arret.setIdArret(null);

        return arretMapper.toDto(arretRepository.save(arret));
    }

    @Override
    @Transactional(readOnly = true)
    public List<ArretDto> getAllArrets() {
        return arretRepository.findAll()
                .stream()
                .map(arretMapper::toDto)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public ArretDto getArretById(Integer id) {
        return arretMapper.toDto(findArretById(id));
    }

    @Override
    public ArretDto updateArret(Integer id, ArretDto arretDto) {
        Arret arret = findArretById(id);
        arretMapper.updateEntityFromDto(arretDto, arret);

        return arretMapper.toDto(arretRepository.save(arret));
    }

    @Override
    public void deleteArret(Integer id) {
        Arret arret = findArretById(id);
        arretRepository.delete(arret);
    }

    private Arret findArretById(Integer id) {
        return arretRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Arret introuvable avec l'id : " + id));
    }
}
