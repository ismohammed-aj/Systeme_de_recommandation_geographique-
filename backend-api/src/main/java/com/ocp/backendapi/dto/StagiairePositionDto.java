package com.ocp.backendapi.dto;

import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StagiairePositionDto {
    private Integer idStagiaire;
    private Integer idUtilisateur;
    private String nom;
    private String prenom;
    private String email;
    private Double latitude;
    private Double longitude;
    private Boolean positionShared;
    private LocalDateTime lastPositionUpdate;
}
