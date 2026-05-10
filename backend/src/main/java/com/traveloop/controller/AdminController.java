package com.traveloop.controller;

import com.traveloop.model.dto.response.AdminStatsResponse;
import com.traveloop.model.dto.response.UserResponse;
import com.traveloop.model.entity.User;
import com.traveloop.repository.UserRepository;
import com.traveloop.service.interfaces.AdminService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Admin-only endpoints for platform analytics and user management.
 * Secured by Spring Security: requires ADMIN role.
 */
@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@Tag(name = "Admin", description = "Platform analytics & user management (ADMIN only)")
public class AdminController {

    private final AdminService adminService;
    private final UserRepository userRepository;

    /* ──────────────────────────────────────────────────
     *  GET /api/admin/stats
     *  Platform-wide KPIs and analytics
     * ────────────────────────────────────────────────── */
    @GetMapping("/stats")
    @Operation(summary = "Get platform statistics",
               description = "Returns KPIs: total users, trips, active/completed counts, " +
                             "top destinations, and budget analytics.")
    public ResponseEntity<AdminStatsResponse> getPlatformStats() {
        AdminStatsResponse stats = adminService.getPlatformStats();
        return ResponseEntity.ok(stats);
    }

    /* ──────────────────────────────────────────────────
     *  GET /api/admin/users
     *  List all users (for admin user table)
     * ────────────────────────────────────────────────── */
    @GetMapping("/users")
    @Operation(summary = "List all platform users",
               description = "Returns a list of all registered users with their profile info.")
    public ResponseEntity<List<UserResponse>> getAllUsers() {
        List<User> users = userRepository.findAll();
        List<UserResponse> responses = users.stream()
                .map(u -> UserResponse.builder()
                        .userId(u.getUserId())
                        .fullName(u.getFullName())
                        .email(u.getEmail())
                        .phoneNumber(u.getPhoneNumber())
                        .city(u.getCity())
                        .country(u.getCountry())
                        .profilePhotoUrl(u.getProfilePhotoUrl())
                        .role(u.getRole())
                        .createdAt(u.getCreatedAt())
                        .build())
                .collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }

    /* ──────────────────────────────────────────────────
     *  DELETE /api/admin/users/{userId}
     *  Remove a user from the platform
     * ────────────────────────────────────────────────── */
    @DeleteMapping("/users/{userId}")
    @Operation(summary = "Delete a user",
               description = "Permanently removes a user and all associated data. Use with caution.")
    public ResponseEntity<Void> deleteUser(@PathVariable java.util.UUID userId) {
        userRepository.deleteById(userId);
        return ResponseEntity.noContent().build();
    }
}
