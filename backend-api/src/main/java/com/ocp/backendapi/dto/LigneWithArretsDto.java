package com.ocp.backendapi.dto;

import java.util.List;
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
public class LigneWithArretsDto {
    private Integer idLigne;
    private String nomLigne;
    private String description;
    private Integer idBus;
    private Integer idChauffeur;
    private List<RecommendationStopDto> stops;
}
