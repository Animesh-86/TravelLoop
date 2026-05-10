package com.traveloop.model.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data @Builder
@NoArgsConstructor @AllArgsConstructor
public class AuthResponse {

    private UUID userId;
    private String email;
    private String fullName;
    private String phoneNumber;
    private String city;
    private String country;
    private String profilePhotoUrl;
    private java.time.LocalDateTime createdAt;
    private String role;
    private String accessToken;
    private String refreshToken;
    private String tokenType;
    private long expiresIn;
}
