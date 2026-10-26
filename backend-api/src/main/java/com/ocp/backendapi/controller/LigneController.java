package com.ocp.backendapi.controller;

import com.ocp.backendapi.dto.LigneDto;
import com.ocp.backendapi.dto.LigneWithArretsDto;
import com.ocp.backendapi.dto.RecommendationStopDto;
import com.ocp.backendapi.service.LigneService;
import jakarta.validation.Valid;
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
@RequestMapping("/api/lignes")
@RequiredArgsConstructor
public class LigneController {
    private final LigneService ligneService;

    @PostMapping
    public ResponseEntity<LigneDto> createLigne(@Valid @RequestBody LigneDto ligneDto) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ligneService.createLigne(ligneDto));
    }

    @GetMapping
    public ResponseEntity<List<LigneDto>> getAllLignes() {
        return ResponseEntity.ok(ligneService.getAllLignes());
    }

    @GetMapping("/with-arrets")
    public ResponseEntity<List<LigneWithArretsDto>> getAllLignesWithArrets() {
        return ResponseEntity.ok(ligneService.getAllLignesWithArrets());
    }

    @GetMapping("/{id}/arrets")
    public ResponseEntity<List<RecommendationStopDto>> getArretsByLigneId(@PathVariable Integer id) {
        return ResponseEntity.ok(ligneService.getArretsByLigneId(id));
    }

    @GetMapping("/{id}")
    public ResponseEntity<LigneDto> getLigneById(@PathVariable Integer id) {
        return ResponseEntity.ok(ligneService.getLigneById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<LigneDto> updateLigne(
            @PathVariable Integer id,
            @Valid @RequestBody LigneDto ligneDto) {
        return ResponseEntity.ok(ligneService.updateLigne(id, ligneDto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLigne(@PathVariable Integer id) {
        ligneService.deleteLigne(id);
        return ResponseEntity.noContent().build();
    }
}
