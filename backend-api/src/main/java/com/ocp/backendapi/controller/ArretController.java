package com.ocp.backendapi.controller;

import com.ocp.backendapi.dto.ArretDto;
import com.ocp.backendapi.service.ArretService;
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
@RequestMapping("/api/arrets")
@RequiredArgsConstructor
public class ArretController {
    private final ArretService arretService;

    @PostMapping
    public ResponseEntity<ArretDto> createArret(@Valid @RequestBody ArretDto arretDto) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(arretService.createArret(arretDto));
    }

    @GetMapping
    public ResponseEntity<List<ArretDto>> getAllArrets() {
        return ResponseEntity.ok(arretService.getAllArrets());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ArretDto> getArretById(@PathVariable Integer id) {
        return ResponseEntity.ok(arretService.getArretById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ArretDto> updateArret(
            @PathVariable Integer id,
            @Valid @RequestBody ArretDto arretDto) {
        return ResponseEntity.ok(arretService.updateArret(id, arretDto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteArret(@PathVariable Integer id) {
        arretService.deleteArret(id);
        return ResponseEntity.noContent().build();
    }
}
