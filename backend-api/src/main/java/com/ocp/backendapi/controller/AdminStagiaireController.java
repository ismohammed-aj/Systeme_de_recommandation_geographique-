package com.ocp.backendapi.controller;

import com.ocp.backendapi.dto.StagiairePositionDto;
import com.ocp.backendapi.service.StagiaireService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/stagiaires")
@RequiredArgsConstructor
public class AdminStagiaireController {
    private final StagiaireService stagiaireService;

    @GetMapping("/positions")
    public ResponseEntity<List<StagiairePositionDto>> getSharedStagiairePositions() {
        return ResponseEntity.ok(stagiaireService.getSharedStagiairePositions());
    }
}
