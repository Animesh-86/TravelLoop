package com.traveloop.model.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.UUID;

@Data @Builder
@NoArgsConstructor @AllArgsConstructor
public class CityResponse {

    private UUID cityId;
    private String cityName;
    private String country;
    private String region;
    private BigDecimal latitude;
    private BigDecimal longitude;
    private Integer costIndex;
    private Integer popularityScore;
    private String description;
    private String imageUrl;
}
