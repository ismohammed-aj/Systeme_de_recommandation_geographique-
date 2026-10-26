package com.ocp.backendapi.service.impl;

import com.ocp.backendapi.dto.UtilisateurDto;
import com.ocp.backendapi.entity.Utilisateur;
import com.ocp.backendapi.exception.ResourceNotFoundException;
import com.ocp.backendapi.mapper.UtilisateurMapper;
import com.ocp.backendapi.repository.UtilisateurRepository;
import com.ocp.backendapi.service.UtilisateurService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class UtilisateurServiceImpl implements UtilisateurService {
    private final UtilisateurRepository utilisateurRepository;
    private final UtilisateurMapper utilisateurMapper;
    private final PasswordEncoder passwordEncoder;

    @Override
    public UtilisateurDto createUtilisateur(UtilisateurDto utilisateurDto) {
        if (utilisateurRepository.existsByEmailIgnoreCase(utilisateurDto.getEmail())) {
            throw new IllegalArgumentException("Un utilisateur avec cet email existe deja");
        }

        utilisateurDto.setRole(resolveRole(utilisateurDto.getRole()));
        Utilisateur utilisateur = utilisateurMapper.toEntity(utilisateurDto);
        utilisateur.setIdUtilisateur(null);
        utilisateur.setEmail(normalizeEmail(utilisateur.getEmail()));
        utilisateur.setMotDePasse(encodePasswordIfNeeded(utilisateur.getMotDePasse()));

        return utilisateurMapper.toDto(utilisateurRepository.save(utilisateur));
    }

    @Override
    @Transactional(readOnly = true)
    public List<UtilisateurDto> getAllUtilisateurs() {
        return utilisateurRepository.findAll()
                .stream()
                .map(utilisateurMapper::toDto)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public UtilisateurDto getUtilisateurById(Integer id) {
        return utilisateurMapper.toDto(findUtilisateurById(id));
    }

    @Override
    public UtilisateurDto updateUtilisateur(Integer id, UtilisateurDto utilisateurDto) {
        Utilisateur utilisateur = findUtilisateurById(id);
        String nextEmail = normalizeEmail(utilisateurDto.getEmail());

        if (!utilisateur.getEmail().equalsIgnoreCase(nextEmail)
                && utilisateurRepository.existsByEmailIgnoreCase(nextEmail)) {
            throw new IllegalArgumentException("Un utilisateur avec cet email existe deja");
        }

        utilisateurDto.setEmail(nextEmail);
        utilisateurDto.setRole(resolveRole(utilisateurDto.getRole()));
        utilisateurMapper.updateEntityFromDto(utilisateurDto, utilisateur);
        utilisateur.setMotDePasse(encodePasswordIfNeeded(utilisateur.getMotDePasse()));

        return utilisateurMapper.toDto(utilisateurRepository.save(utilisateur));
    }

    @Override
    public void deleteUtilisateur(Integer id) {
        Utilisateur utilisateur = findUtilisateurById(id);
        utilisateurRepository.delete(utilisateur);
    }

    private Utilisateur findUtilisateurById(Integer id) {
        return utilisateurRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur introuvable avec l'id : " + id));
    }

    private String resolveRole(String role) {
        return role == null || role.isBlank()
                ? Utilisateur.DEFAULT_ROLE
                : role.trim().toUpperCase();
    }

    private String normalizeEmail(String email) {
        return email == null ? null : email.trim().toLowerCase();
    }

    private String encodePasswordIfNeeded(String password) {
        if (password == null || password.isBlank() || isBcryptHash(password)) {
            return password;
        }

        return passwordEncoder.encode(password);
    }

    private boolean isBcryptHash(String password) {
        return password != null && password.matches("^\\$2[aby]\\$.{56}$");
    }
}
