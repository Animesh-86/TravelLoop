package com.traveloop.service.impl;

import com.traveloop.model.dto.response.AdminStatsResponse;
import com.traveloop.repository.BudgetRepository;
import com.traveloop.repository.TripRepository;
import com.traveloop.repository.UserRepository;
import com.traveloop.service.interfaces.AdminService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

/**
 * Aggregates platform-wide analytics from multiple repositories.
 * Powers the admin dashboard with KPIs, growth charts, and top destinations.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class AdminServiceImpl implements AdminService {

    private final UserRepository userRepository;
    private final TripRepository tripRepository;
    private final BudgetRepository budgetRepository;

    @Override
    public AdminStatsResponse getPlatformStats() {
        log.debug("Fetching platform-wide admin stats");

        // ── KPIs ──
        long totalUsers = userRepository.count();
        long totalTrips = tripRepository.count();
        long activeTrips = tripRepository.countByStatus("active");
        long completedTrips = tripRepository.countByStatus("completed");
        long publicTrips = tripRepository.countByIsPublicTrue();

        // ── Top destinations ──
        List<Object[]> topRaw = tripRepository.findTopDestinations();
        List<AdminStatsResponse.CityPopularity> topCities = topRaw.stream()
                .limit(10)
                .map(row -> AdminStatsResponse.CityPopularity.builder()
                        .cityName((String) row[0])
                        .country((String) row[1])
                        .tripCount(((Long) row[2]).intValue())
                        .build())
                .collect(Collectors.toList());

        return AdminStatsResponse.builder()
                .totalUsers(totalUsers)
                .totalTrips(totalTrips)
                .activeTrips(activeTrips)
                .completedTrips(completedTrips)
                .publicTrips(publicTrips)
                .topCities(topCities)
                .userGrowth(List.of())   // Placeholder — would need created_at aggregation
                .tripGrowth(List.of())   // Placeholder — would need created_at aggregation
                .avgBudgetByCategory(Map.of())
                .build();
    }
}
