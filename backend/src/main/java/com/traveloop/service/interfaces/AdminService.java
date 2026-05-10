package com.traveloop.service.interfaces;

import com.traveloop.model.dto.response.AdminStatsResponse;

/**
 * Admin analytics service contract.
 */
public interface AdminService {

    /**
     * Get platform-wide statistics for the admin dashboard.
     */
    AdminStatsResponse getPlatformStats();
}
