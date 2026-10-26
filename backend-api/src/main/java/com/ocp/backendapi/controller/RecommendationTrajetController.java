package com.ocp.backendapi.controller;

import com.ocp.backendapi.dto.PositionRequestDto;
import com.ocp.backendapi.dto.RecommendationResultDto;
import com.ocp.backendapi.dto.RecommendationTrajetDto;
import com.ocp.backendapi.service.RecommendationTrajetService;
import com.ocp.backendapi.service.geolocation.GeolocationService;
import jakarta.validation.Valid;
import java.security.Principal;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/recommendations")
@RequiredArgsConstructor
public class RecommendationTrajetController {
    private final RecommendationTrajetService recommendationTrajetService;
    private final GeolocationService geolocationService;

    @PostMapping
    public ResponseEntity<RecommendationTrajetDto> createRecommendation(
            @Valid @RequestBody RecommendationTrajetDto recommendationTrajetDto) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(recommendationTrajetService.createRecommendation(recommendationTrajetDto));
    }

    @GetMapping
    public ResponseEntity<List<RecommendationTrajetDto>> getAllRecommendations() {
        return ResponseEntity.ok(recommendationTrajetService.getAllRecommendations());
    }

    @GetMapping("/{id}")
    public ResponseEntity<RecommendationTrajetDto> getRecommendationById(@PathVariable Integer id) {
        return ResponseEntity.ok(recommendationTrajetService.getRecommendationById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<RecommendationTrajetDto> updateRecommendation(
            @PathVariable Integer id,
            @Valid @RequestBody RecommendationTrajetDto recommendationTrajetDto) {
        return ResponseEntity.ok(recommendationTrajetService.updateRecommendation(id, recommendationTrajetDto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRecommendation(@PathVariable Integer id) {
        recommendationTrajetService.deleteRecommendation(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/stagiaire/{idStagiaire}")
    public ResponseEntity<List<RecommendationTrajetDto>> getRecommendationsByStagiaireId(
            @PathVariable Integer idStagiaire) {
        return ResponseEntity.ok(recommendationTrajetService.getRecommendationsByStagiaireId(idStagiaire));
    }

    @GetMapping("/best-line/{idStagiaire}")
    public ResponseEntity<RecommendationResultDto> getBestLineForStagiaire(@PathVariable Integer idStagiaire) {
        return ResponseEntity.ok(geolocationService.findBestLineForStagiaire(idStagiaire));
    }

    @PostMapping("/best-line/by-position")
    public ResponseEntity<RecommendationResultDto> getBestLineByPosition(
            Principal principal,
            @Valid @RequestBody PositionRequestDto request) {
        String email = principal == null ? null : principal.getName();

        return ResponseEntity.ok(geolocationService.findBestLineByPosition(email, request));
    }
}
