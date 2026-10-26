package com.ocp.backendapi.dto;

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
public class LigneDto {
    private Integer idLigne;

    @NotBlank(message = "Le nom de la ligne est obligatoire")
    @Size(max = 100, message = "Le nom de la ligne ne doit pas depasser 100 caracteres")
    private String nomLigne;

    private String description;

    private Integer idBus;

    private Integer idChauffeur;
}
