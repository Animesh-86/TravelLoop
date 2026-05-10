package com.traveloop.controller;

import com.traveloop.model.dto.response.CityResponse;
import com.traveloop.service.interfaces.CityService;
import com.traveloop.service.interfaces.WebScraperService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/cities")
@Tag(name = "Cities", description = "Browse and search destination cities")
public class CityController {

    private final CityService cityService;
    private final WebScraperService scraperService;

    public CityController(CityService cityService, WebScraperService scraperService) {
        this.cityService = cityService;
        this.scraperService = scraperService;
    }

    @GetMapping
    @Operation(summary = "Get all cities")
    public ResponseEntity<List<CityResponse>> getAllCities() {
        return ResponseEntity.ok(cityService.getAllCities());
    }

    @GetMapping("/{cityId}")
    @Operation(summary = "Get city by ID")
    public ResponseEntity<CityResponse> getCityById(@PathVariable UUID cityId) {
        return ResponseEntity.ok(cityService.getCityById(cityId));
    }

    @GetMapping("/search")
    @Operation(summary = "Search cities by name or country")
    public ResponseEntity<List<CityResponse>> searchCities(@RequestParam String q) {
        return ResponseEntity.ok(cityService.searchCities(q));
    }

    @GetMapping("/popular")
    @Operation(summary = "Get top 10 popular cities")
    public ResponseEntity<List<CityResponse>> getPopularCities() {
        return ResponseEntity.ok(cityService.getPopularCities());
    }

    @GetMapping("/country/{country}")
    @Operation(summary = "Get cities by country")
    public ResponseEntity<List<CityResponse>> getCitiesByCountry(@PathVariable String country) {
        return ResponseEntity.ok(cityService.getCitiesByCountry(country));
    }

    @GetMapping("/budget")
    @Operation(summary = "Get budget-friendly cities by max cost index (1-5)")
    public ResponseEntity<List<CityResponse>> getBudgetCities(@RequestParam Integer maxCost) {
        return ResponseEntity.ok(cityService.getBudgetFriendlyCities(maxCost));
    }

    @GetMapping("/countries")
    @Operation(summary = "Get list of all available countries")
    public ResponseEntity<List<String>> getAllCountries() {
        return ResponseEntity.ok(cityService.getAllCountries());
    }

    @GetMapping("/guide")
    @Operation(summary = "Get scraped travel guide from Wikivoyage for a destination")
    public ResponseEntity<Map<String, String>> getCityGuide(@RequestParam String city) {
        return ResponseEntity.ok(scraperService.scrapeDestinationGuide(city));
    }
}
