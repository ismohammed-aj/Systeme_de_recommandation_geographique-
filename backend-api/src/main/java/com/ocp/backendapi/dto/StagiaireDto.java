package com.ocp.backendapi.dto;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
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
public class StagiaireDto {
    private Integer idStagiaire;

    @NotNull(message = "L'utilisateur est obligatoire")
    private Integer idUtilisateur;

    @Size(max = 20, message = "Le telephone ne doit pas depasser 20 caracteres")
    private String telephone;

    private String adresse;

    @Size(max = 100, message = "La ville d'origine ne doit pas depasser 100 caracteres")
    private String villeOrigine;

    @DecimalMin(value = "-90.0", message = "La latitude doit etre superieure ou egale a -90")
    @DecimalMax(value = "90.0", message = "La latitude doit etre inferieure ou egale a 90")
    private Double latitude;

    @DecimalMin(value = "-180.0", message = "La longitude doit etre superieure ou egale a -180")
    @DecimalMax(value = "180.0", message = "La longitude doit etre inferieure ou egale a 180")
    private Double longitude;

    private Boolean positionShared;

    private LocalDateTime lastPositionUpdate;
}
