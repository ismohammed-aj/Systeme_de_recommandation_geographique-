package com.ocp.backendapi.dto;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
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
public class ArretDto {
    private Integer idArret;

    @NotBlank(message = "Le nom de l'arret est obligatoire")
    @Size(max = 150, message = "Le nom de l'arret ne doit pas depasser 150 caracteres")
    private String nomArret;

    @NotNull(message = "La latitude est obligatoire")
    @DecimalMin(value = "-90.0", message = "La latitude doit etre superieure ou egale a -90")
    @DecimalMax(value = "90.0", message = "La latitude doit etre inferieure ou egale a 90")
    private Double latitude;

    @NotNull(message = "La longitude est obligatoire")
    @DecimalMin(value = "-180.0", message = "La longitude doit etre superieure ou egale a -180")
    @DecimalMax(value = "180.0", message = "La longitude doit etre inferieure ou egale a 180")
    private Double longitude;

    private String adresse;
}
