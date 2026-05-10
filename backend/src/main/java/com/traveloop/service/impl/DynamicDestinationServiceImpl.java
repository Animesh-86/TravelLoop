package com.traveloop.service.impl;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.traveloop.model.entity.City;
import com.traveloop.repository.CityRepository;
import com.traveloop.service.interfaces.DynamicDestinationService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.ai.chat.model.ChatModel;
import org.springframework.ai.chat.prompt.Prompt;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Service
public class DynamicDestinationServiceImpl implements DynamicDestinationService {

    private static final Logger log = LoggerFactory.getLogger(DynamicDestinationServiceImpl.class);
    
    private final ChatModel chatModel;
    private final CityRepository cityRepository;
    private final ObjectMapper objectMapper;

    public DynamicDestinationServiceImpl(ChatModel chatModel, CityRepository cityRepository, ObjectMapper objectMapper) {
        this.chatModel = chatModel;
        this.cityRepository = cityRepository;
        this.objectMapper = objectMapper;
    }

    @Override
    @Transactional
    public City discoverCity(String query) {
        try {
            log.info("Dynamically discovering city for query: {}", query);
            
            String promptText = String.format(
                "Provide detailed travel information for the city or destination matching: '%s'. " +
                "Return the response STRICTLY as a JSON object with the following fields: " +
                "cityName (string), country (string), region (string), latitude (number), longitude (number), " +
                "costIndex (integer 1-5 where 1 is very cheap and 5 is very expensive), " +
                "popularityScore (integer 1-100), description (string, a short engaging description), " +
                "imageUrl (string, a generic valid unsplash image URL for this city). " +
                "Do NOT include any markdown formatting like ```json, just return the raw JSON object.",
                query
            );

            String aiResponse = chatModel.call(new Prompt(promptText)).getResult().getOutput().getContent();
            
            // Clean up possible markdown
            if (aiResponse.startsWith("```json")) {
                aiResponse = aiResponse.substring(7);
                if (aiResponse.endsWith("```")) {
                    aiResponse = aiResponse.substring(0, aiResponse.length() - 3);
                }
            }

            JsonNode node = objectMapper.readTree(aiResponse.trim());

            City city = City.builder()
                .cityName(node.get("cityName").asText())
                .country(node.get("country").asText())
                .region(node.has("region") ? node.get("region").asText() : null)
                .latitude(new BigDecimal(node.get("latitude").asText()))
                .longitude(new BigDecimal(node.get("longitude").asText()))
                .costIndex(node.get("costIndex").asInt())
                .popularityScore(node.get("popularityScore").asInt())
                .description(node.get("description").asText())
                .imageUrl(node.get("imageUrl").asText())
                .build();

            return cityRepository.save(city);

        } catch (Exception e) {
            log.error("Failed to dynamically discover city: {}", query, e);
            return null;
        }
    }
}
