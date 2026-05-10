package com.traveloop.service.interfaces;

import com.traveloop.model.dto.response.CityResponse;

import java.util.List;
import java.util.UUID;

public interface CityService {

    List<CityResponse> getAllCities();

    CityResponse getCityById(UUID cityId);

    List<CityResponse> searchCities(String query);

    List<CityResponse> getPopularCities();

    List<CityResponse> getCitiesByCountry(String country);

    List<CityResponse> getBudgetFriendlyCities(Integer maxCostIndex);

    List<String> getAllCountries();
}
