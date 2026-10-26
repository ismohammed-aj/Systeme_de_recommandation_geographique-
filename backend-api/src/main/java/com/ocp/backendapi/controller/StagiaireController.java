package com.ocp.backendapi.controller;

import com.ocp.backendapi.dto.PositionRequestDto;
import com.ocp.backendapi.dto.StagiaireDto;
import com.ocp.backendapi.service.StagiaireService;
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
@RequestMapping("/api/stagiaires")
@RequiredArgsConstructor
public class StagiaireController {
    private final StagiaireService stagiaireService;

    @PostMapping
    public ResponseEntity<StagiaireDto> createStagiaire(@Valid @RequestBody StagiaireDto stagiaireDto) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(stagiaireService.createStagiaire(stagiaireDto));
    }

    @GetMapping
    public ResponseEntity<List<StagiaireDto>> getAllStagiaires() {
        return ResponseEntity.ok(stagiaireService.getAllStagiaires());
    }

    @PostMapping("/me/position")
    public ResponseEntity<StagiaireDto> updateCurrentStagiairePosition(
            Principal principal,
            @Valid @RequestBody PositionRequestDto positionRequestDto) {
        return ResponseEntity.ok(
                stagiaireService.updateCurrentStagiairePosition(principal.getName(), positionRequestDto));
    }

    @GetMapping("/{id}")
    public ResponseEntity<StagiaireDto> getStagiaireById(@PathVariable Integer id) {
        return ResponseEntity.ok(stagiaireService.getStagiaireById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<StagiaireDto> updateStagiaire(
            @PathVariable Integer id,
            @Valid @RequestBody StagiaireDto stagiaireDto) {
        return ResponseEntity.ok(stagiaireService.updateStagiaire(id, stagiaireDto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteStagiaire(@PathVariable Integer id) {
        stagiaireService.deleteStagiaire(id);
        return ResponseEntity.noContent().build();
    }
}
