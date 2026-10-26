package com.ocp.backendapi.controller;

import com.ocp.backendapi.dto.LigneArretDto;
import com.ocp.backendapi.service.LigneArretService;
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
@RequestMapping("/api/ligne-arrets")
@RequiredArgsConstructor
public class LigneArretController {
    private final LigneArretService ligneArretService;

    @PostMapping
    public ResponseEntity<LigneArretDto> createLigneArret(@Valid @RequestBody LigneArretDto ligneArretDto) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ligneArretService.createLigneArret(ligneArretDto));
    }

    @GetMapping
    public ResponseEntity<List<LigneArretDto>> getAllLigneArrets() {
        return ResponseEntity.ok(ligneArretService.getAllLigneArrets());
    }

    @GetMapping("/{id}")
    public ResponseEntity<LigneArretDto> getLigneArretById(@PathVariable Integer id) {
        return ResponseEntity.ok(ligneArretService.getLigneArretById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<LigneArretDto> updateLigneArret(
            @PathVariable Integer id,
            @Valid @RequestBody LigneArretDto ligneArretDto) {
        return ResponseEntity.ok(ligneArretService.updateLigneArret(id, ligneArretDto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLigneArret(@PathVariable Integer id) {
        ligneArretService.deleteLigneArret(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/ligne/{idLigne}")
    public ResponseEntity<List<LigneArretDto>> getLigneArretsByLigneId(@PathVariable Integer idLigne) {
        return ResponseEntity.ok(ligneArretService.getLigneArretsByLigneId(idLigne));
    }
}
