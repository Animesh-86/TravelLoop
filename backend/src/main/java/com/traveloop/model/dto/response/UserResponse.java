package com.traveloop.model.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data @Builder
@NoArgsConstructor @AllArgsConstructor
public class UserResponse {

    private UUID userId;
    private String email;
    private String fullName;
    private String phoneNumber;
    private String city;
    private String country;
    private String profilePhotoUrl;
    private String role;
    private LocalDateTime createdAt;
}
