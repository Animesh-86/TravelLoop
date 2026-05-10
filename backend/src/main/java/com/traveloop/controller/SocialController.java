package com.traveloop.controller;

import com.traveloop.model.entity.CommunityMessage;
import com.traveloop.model.entity.User;
import com.traveloop.repository.CommunityMessageRepository;
import com.traveloop.repository.UserRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/social")
@RequiredArgsConstructor
@Tag(name = "Social", description = "Community and interaction endpoints")
@CrossOrigin(origins = "*")
public class SocialController {

    private final CommunityMessageRepository messageRepository;
    private final UserRepository userRepository;

    @GetMapping("/messages")
    @Operation(summary = "Get latest community messages")
    public ResponseEntity<List<Map<String, Object>>> getMessages() {
        return ResponseEntity.ok(
            messageRepository.findLatestMessages().stream().map(m -> Map.of(
                "id", m.getMessageId(),
                "content", m.getContent(),
                "createdAt", m.getCreatedAt(),
                "user", Map.of(
                    "userId", m.getUser().getUserId(),
                    "fullName", m.getUser().getFullName(),
                    "avatarUrl", m.getUser().getProfilePhotoUrl() != null ? m.getUser().getProfilePhotoUrl() : ""
                )
            )).collect(Collectors.toList())
        );
    }

    @PostMapping("/messages")
    @Operation(summary = "Post a community message")
    public ResponseEntity<?> postMessage(@RequestBody Map<String, String> body, Authentication authentication) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        CommunityMessage message = CommunityMessage.builder()
                .user(user)
                .content(body.get("content"))
                .build();

        messageRepository.save(message);
        return ResponseEntity.ok().build();
    }
}
