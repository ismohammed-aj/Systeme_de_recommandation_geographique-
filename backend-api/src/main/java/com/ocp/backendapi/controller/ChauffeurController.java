package com.ocp.backendapi.controller;

import com.ocp.backendapi.dto.ChauffeurDto;
import com.ocp.backendapi.service.ChauffeurService;
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
@RequestMapping("/api/chauffeurs")
@RequiredArgsConstructor
public class ChauffeurController {
    private final ChauffeurService chauffeurService;

    @PostMapping
    public ResponseEntity<ChauffeurDto> createChauffeur(@Valid @RequestBody ChauffeurDto chauffeurDto) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(chauffeurService.createChauffeur(chauffeurDto));
    }

    @GetMapping
    public ResponseEntity<List<ChauffeurDto>> getAllChauffeurs() {
        return ResponseEntity.ok(chauffeurService.getAllChauffeurs());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ChauffeurDto> getChauffeurById(@PathVariable Integer id) {
        return ResponseEntity.ok(chauffeurService.getChauffeurById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ChauffeurDto> updateChauffeur(
            @PathVariable Integer id,
            @Valid @RequestBody ChauffeurDto chauffeurDto) {
        return ResponseEntity.ok(chauffeurService.updateChauffeur(id, chauffeurDto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteChauffeur(@PathVariable Integer id) {
        chauffeurService.deleteChauffeur(id);
        return ResponseEntity.noContent().build();
    }
}
