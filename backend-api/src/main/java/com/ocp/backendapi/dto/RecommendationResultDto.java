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
public class RecommendationResultDto {
    private Integer idLigne;
    private Integer idArret;
    private Integer idStagiaire;
    private String nomLigne;
    private String nomArret;
    private Double distance;
    private Double latitudeArret;
    private Double longitudeArret;
    private List<RecommendationStopDto> stops;
}
