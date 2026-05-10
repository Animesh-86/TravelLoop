package com.traveloop.service.impl;

import com.traveloop.exception.ResourceNotFoundException;
import com.traveloop.model.dto.response.CityResponse;
import com.traveloop.model.entity.City;
import com.traveloop.repository.CityRepository;
import com.traveloop.service.interfaces.CityService;
import org.modelmapper.ModelMapper;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class CityServiceImpl implements CityService {

    private final CityRepository cityRepository;
    private final ModelMapper modelMapper;
    private final com.traveloop.service.interfaces.DynamicDestinationService dynamicDestinationService;

    public CityServiceImpl(CityRepository cityRepository, ModelMapper modelMapper, com.traveloop.service.interfaces.DynamicDestinationService dynamicDestinationService) {
        this.cityRepository = cityRepository;
        this.modelMapper = modelMapper;
        this.dynamicDestinationService = dynamicDestinationService;
    }

    @Override
    @Cacheable("cities")
    public List<CityResponse> getAllCities() {
        return cityRepository.findAll().stream()
                .map(this::toResponse).collect(Collectors.toList());
    }

    @Override
    public CityResponse getCityById(UUID cityId) {
        City city = cityRepository.findById(cityId)
                .orElseThrow(() -> new ResourceNotFoundException("City not found: " + cityId));
        return toResponse(city);
    }

    @Override
    public List<CityResponse> searchCities(String query) {
        List<City> cities = cityRepository.searchByNameOrCountry(query);
        if (cities.isEmpty() && query != null && query.length() > 2) {
            City dynamicCity = dynamicDestinationService.discoverCity(query);
            if (dynamicCity != null) {
                cities.add(dynamicCity);
            }
        }
        return cities.stream()
                .map(this::toResponse).collect(Collectors.toList());
    }

    @Override
    @Cacheable("popularCities")
    public List<CityResponse> getPopularCities() {
        return cityRepository.findTop10ByOrderByPopularityScoreDesc().stream()
                .map(this::toResponse).collect(Collectors.toList());
    }

    @Override
    public List<CityResponse> getCitiesByCountry(String country) {
        return cityRepository.findByCountryIgnoreCase(country).stream()
                .map(this::toResponse).collect(Collectors.toList());
    }

    @Override
    public List<CityResponse> getBudgetFriendlyCities(Integer maxCostIndex) {
        return cityRepository.findByCostIndexLessThanEqual(maxCostIndex).stream()
                .map(this::toResponse).collect(Collectors.toList());
    }

    @Override
    @Cacheable("countries")
    public List<String> getAllCountries() {
        return cityRepository.findAllCountries();
    }

    private CityResponse toResponse(City city) {
        return modelMapper.map(city, CityResponse.class);
    }
}
