package com.ocp.backendapi.dto;

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
public class RecommendationStopDto {
    private Integer idArret;
    private String nomArret;
    private Double latitude;
    private Double longitude;
    private String adresse;
    private Integer ordre;
}
