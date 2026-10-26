package com.ocp.backendapi.controller;

import com.ocp.backendapi.dto.BusDto;
import com.ocp.backendapi.service.BusService;
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
@RequestMapping("/api/bus")
@RequiredArgsConstructor
public class BusController {
    private final BusService busService;

    @PostMapping
    public ResponseEntity<BusDto> createBus(@Valid @RequestBody BusDto busDto) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(busService.createBus(busDto));
    }

    @GetMapping
    public ResponseEntity<List<BusDto>> getAllBus() {
        return ResponseEntity.ok(busService.getAllBus());
    }

    @GetMapping("/{id}")
    public ResponseEntity<BusDto> getBusById(@PathVariable Integer id) {
        return ResponseEntity.ok(busService.getBusById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<BusDto> updateBus(
            @PathVariable Integer id,
            @Valid @RequestBody BusDto busDto) {
        return ResponseEntity.ok(busService.updateBus(id, busDto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBus(@PathVariable Integer id) {
        busService.deleteBus(id);
        return ResponseEntity.noContent().build();
    }
}
