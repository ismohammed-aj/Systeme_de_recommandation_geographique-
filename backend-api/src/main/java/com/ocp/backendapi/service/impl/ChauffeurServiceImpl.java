package com.ocp.backendapi.service.impl;

import com.ocp.backendapi.dto.ChauffeurDto;
import com.ocp.backendapi.entity.Chauffeur;
import com.ocp.backendapi.exception.ResourceNotFoundException;
import com.ocp.backendapi.mapper.ChauffeurMapper;
import com.ocp.backendapi.repository.ChauffeurRepository;
import com.ocp.backendapi.service.ChauffeurService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class ChauffeurServiceImpl implements ChauffeurService {
    private final ChauffeurRepository chauffeurRepository;
    private final ChauffeurMapper chauffeurMapper;

    @Override
    public ChauffeurDto createChauffeur(ChauffeurDto chauffeurDto) {
        Chauffeur chauffeur = chauffeurMapper.toEntity(chauffeurDto);
        chauffeur.setIdChauffeur(null);

        return chauffeurMapper.toDto(chauffeurRepository.save(chauffeur));
    }

    @Override
    @Transactional(readOnly = true)
    public List<ChauffeurDto> getAllChauffeurs() {
        return chauffeurRepository.findAll()
                .stream()
                .map(chauffeurMapper::toDto)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public ChauffeurDto getChauffeurById(Integer id) {
        return chauffeurMapper.toDto(findChauffeurById(id));
    }

    @Override
    public ChauffeurDto updateChauffeur(Integer id, ChauffeurDto chauffeurDto) {
        Chauffeur chauffeur = findChauffeurById(id);
        chauffeurMapper.updateEntityFromDto(chauffeurDto, chauffeur);

        return chauffeurMapper.toDto(chauffeurRepository.save(chauffeur));
    }

    @Override
    public void deleteChauffeur(Integer id) {
        Chauffeur chauffeur = findChauffeurById(id);
        chauffeurRepository.delete(chauffeur);
    }

    private Chauffeur findChauffeurById(Integer id) {
        return chauffeurRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Chauffeur introuvable avec l'id : " + id));
    }
}
