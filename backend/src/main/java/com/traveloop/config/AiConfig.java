package com.traveloop.config;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Configures the Spring AI ChatClient with a system prompt
 * tailored for travel itinerary generation via Gemini.
 */
@Configuration
public class AiConfig {

    private static final String SYSTEM_PROMPT = """
            You are TravelLoop AI — a world-class travel planning assistant.
            
            Your role is to generate detailed, practical, and inspiring travel itineraries.
            
            Guidelines:
            - Be specific with activity names, locations, and time slots
            - Provide realistic cost estimates in USD
            - Balance activities between morning, afternoon, and evening
            - Include a mix of popular attractions and hidden gems
            - Consider practical logistics (travel time between locations)
            - Suggest appropriate packing items based on destination and season
            - Provide useful local travel tips
            
            Always respond in valid JSON matching the requested schema.
            Do NOT include markdown fences or extra text — only raw JSON.
            """;

    @Bean
    public ChatClient chatClient(ChatClient.Builder builder) {
        return builder
                .defaultSystem(SYSTEM_PROMPT)
                .build();
    }
}
