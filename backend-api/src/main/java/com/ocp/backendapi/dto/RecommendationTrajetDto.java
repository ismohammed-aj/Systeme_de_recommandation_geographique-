package com.ocp.backendapi.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
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
public class RecommendationTrajetDto {
    private Integer idRecommandation;

    @NotNull(message = "Le stagiaire est obligatoire")
    private Integer idStagiaire;

    @NotNull(message = "La ligne est obligatoire")
    private Integer idLigne;

    @NotNull(message = "L'arret est obligatoire")
    private Integer idArret;

    @PositiveOrZero(message = "La distance doit etre superieure ou egale a 0")
    private Double distance;

    private LocalDateTime dateRecherche;
}
