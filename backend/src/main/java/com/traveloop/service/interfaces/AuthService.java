package com.traveloop.service.interfaces;

import com.traveloop.model.dto.request.LoginRequest;
import com.traveloop.model.dto.request.RegisterRequest;
import com.traveloop.model.dto.response.AuthResponse;
import com.traveloop.model.dto.response.UserResponse;

import java.util.UUID;

public interface AuthService {

    AuthResponse register(RegisterRequest request);

    AuthResponse login(LoginRequest request);

    AuthResponse refreshToken(String refreshToken);

    AuthResponse googleLogin(String idToken);

    UserResponse getCurrentUser(UUID userId);
}
