package com.traveloop.service.interfaces;

import java.util.List;

public interface RecommendationService {
    List<String> getRecommendations(String location);
}
