package com.traveloop.service.impl;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.traveloop.service.interfaces.RecommendationService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.ai.chat.model.ChatModel;
import org.springframework.ai.chat.prompt.Prompt;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class RecommendationServiceImpl implements RecommendationService {

    private static final Logger log = LoggerFactory.getLogger(RecommendationServiceImpl.class);

    private final ChatModel chatModel;
    private final ObjectMapper objectMapper;

    public RecommendationServiceImpl(ChatModel chatModel, ObjectMapper objectMapper) {
        this.chatModel = chatModel;
        this.objectMapper = objectMapper;
    }

    @Override
    @Cacheable(value = "recommendations", key = "#location")
    public List<String> getRecommendations(String location) {
        try {
            log.info("Generating AI recommendations for location: {}", location);

            String promptText = String.format(
                    "List 6 highly famous places to visit or popular things to do in or around '%s'. " +
                    "Return ONLY a JSON array of strings containing the names of these places/activities. " +
                    "For example: [\"Baga Beach\", \"Dudhsagar Waterfalls\", \"Basilica of Bom Jesus\", \"Fort Aguada\", \"Anjuna Flea Market\", \"Palolem Beach\"]. " +
                    "Do NOT include any markdown formatting like ```json, just return the raw JSON array.",
                    location
            );

            String aiResponse = chatModel.call(new Prompt(promptText)).getResult().getOutput().getContent();

            // Clean up possible markdown
            if (aiResponse.startsWith("```json")) {
                aiResponse = aiResponse.substring(7);
                if (aiResponse.endsWith("```")) {
                    aiResponse = aiResponse.substring(0, aiResponse.length() - 3);
                }
            } else if (aiResponse.startsWith("```")) {
                aiResponse = aiResponse.substring(3);
                if (aiResponse.endsWith("```")) {
                    aiResponse = aiResponse.substring(0, aiResponse.length() - 3);
                }
            }

            return objectMapper.readValue(aiResponse.trim(), new TypeReference<List<String>>() {});

        } catch (Exception e) {
            log.error("Failed to generate recommendations for: {}", location, e);
            return new ArrayList<>();
        }
    }
}
