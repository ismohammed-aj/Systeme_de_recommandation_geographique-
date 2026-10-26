package com.ocp.backendapi.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
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
public class LigneArretDto {
    private Integer idLigneArret;

    @NotNull(message = "La ligne est obligatoire")
    private Integer idLigne;

    @NotNull(message = "L'arret est obligatoire")
    private Integer idArret;

    @NotNull(message = "L'ordre est obligatoire")
    @Positive(message = "L'ordre doit etre positif")
    private Integer ordre;
}
