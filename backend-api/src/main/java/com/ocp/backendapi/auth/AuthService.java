package com.ocp.backendapi.auth;

import com.ocp.backendapi.entity.Utilisateur;
import com.ocp.backendapi.repository.UtilisateurRepository;
import com.ocp.backendapi.security.JwtService;
import java.util.List;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class AuthService {
    private final UtilisateurRepository utilisateurRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthResponse login(LoginRequest request) {
        String email = normalizeEmail(request.getEmail());
        Utilisateur utilisateur = utilisateurRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new IllegalArgumentException("Email ou mot de passe incorrect"));

        if (!passwordMatches(request.getMotDePasse(), utilisateur)) {
            throw new IllegalArgumentException("Email ou mot de passe incorrect");
        }

        return buildAuthResponse(utilisateur);
    }

    public AuthResponse register(RegisterRequest request) {
        String email = normalizeEmail(request.getEmail());

        if (utilisateurRepository.existsByEmailIgnoreCase(email)) {
            throw new IllegalArgumentException("Un utilisateur avec cet email existe deja");
        }

        Utilisateur utilisateur = Utilisateur.builder()
                .nom(request.getNom().trim())
                .prenom(request.getPrenom().trim())
                .email(email)
                .motDePasse(passwordEncoder.encode(request.getMotDePasse()))
                .role(Utilisateur.DEFAULT_ROLE)
                .build();

        return buildAuthResponse(utilisateurRepository.save(utilisateur));
    }

    private AuthResponse buildAuthResponse(Utilisateur utilisateur) {
        String role = normalizeRole(utilisateur.getRole());
        UserDetails userDetails = buildUserDetails(utilisateur, role);
        String token = jwtService.generateToken(Map.of("role", role), userDetails);

        return AuthResponse.builder()
                .token(token)
                .role(role)
                .email(utilisateur.getEmail())
                .nom(utilisateur.getNom())
                .prenom(utilisateur.getPrenom())
                .build();
    }

    private boolean passwordMatches(String rawPassword, Utilisateur utilisateur) {
        String storedPassword = utilisateur.getMotDePasse();

        if (isBcryptHash(storedPassword)) {
            return passwordEncoder.matches(rawPassword, storedPassword);
        }

        if (rawPassword.equals(storedPassword)) {
            utilisateur.setMotDePasse(passwordEncoder.encode(rawPassword));
            utilisateurRepository.save(utilisateur);
            return true;
        }

        return false;
    }

    private UserDetails buildUserDetails(Utilisateur utilisateur, String role) {
        return User.builder()
                .username(utilisateur.getEmail())
                .password(utilisateur.getMotDePasse())
                .authorities(List.of(new SimpleGrantedAuthority("ROLE_" + role)))
                .build();
    }

    private String normalizeEmail(String email) {
        return email == null ? null : email.trim().toLowerCase();
    }

    private String normalizeRole(String role) {
        return role == null || role.isBlank()
                ? Utilisateur.DEFAULT_ROLE
                : role.trim().toUpperCase();
    }

    private boolean isBcryptHash(String password) {
        return password != null && password.matches("^\\$2[aby]\\$.{56}$");
    }
}
