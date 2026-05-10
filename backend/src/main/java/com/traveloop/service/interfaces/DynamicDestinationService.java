package com.traveloop.service.interfaces;

import com.traveloop.model.entity.City;

public interface DynamicDestinationService {
    City discoverCity(String query);
}
