package com.traveloop.repository;

import com.traveloop.model.entity.City;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface CityRepository extends JpaRepository<City, UUID> {

    List<City> findByCountryIgnoreCase(String country);

    @Query("SELECT c FROM City c WHERE LOWER(c.cityName) LIKE LOWER(CONCAT('%', :query, '%')) " +
           "OR LOWER(c.country) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<City> searchByNameOrCountry(@Param("query") String query);

    List<City> findTop10ByOrderByPopularityScoreDesc();

    List<City> findByCostIndexLessThanEqual(Integer maxCostIndex);

    @Query("SELECT DISTINCT c.country FROM City c ORDER BY c.country")
    List<String> findAllCountries();

    Optional<City> findFirstByCityNameContainingIgnoreCase(String cityName);
}
