package com.ocp.backendapi.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
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
public class BusDto {
    private Integer idBus;

    @NotBlank(message = "Le matricule est obligatoire")
    @Size(max = 100, message = "Le matricule ne doit pas depasser 100 caracteres")
    private String matricule;

    @Min(value = 0, message = "La capacite doit etre superieure ou egale a 0")
    private Integer capacite;

    @Size(max = 50, message = "Le statut ne doit pas depasser 50 caracteres")
    private String statut;
}
