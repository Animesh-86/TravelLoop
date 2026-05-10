package com.traveloop.service.impl;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.traveloop.service.interfaces.ReceiptScannerService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.ai.chat.messages.Media;
import org.springframework.ai.chat.messages.UserMessage;
import org.springframework.ai.chat.model.ChatModel;
import org.springframework.ai.chat.model.ChatResponse;
import org.springframework.ai.chat.prompt.Prompt;
import org.springframework.stereotype.Service;
import org.springframework.util.MimeTypeUtils;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@Service
public class ReceiptScannerServiceImpl implements ReceiptScannerService {

    private static final Logger log = LoggerFactory.getLogger(ReceiptScannerServiceImpl.class);
    private final ChatModel chatModel;
    private final ObjectMapper objectMapper;

    public ReceiptScannerServiceImpl(ChatModel chatModel, ObjectMapper objectMapper) {
        this.chatModel = chatModel;
        this.objectMapper = objectMapper;
    }

    @Override
    public Map<String, Object> scanReceipt(MultipartFile file) {
        try {
            log.info("Scanning receipt image: {}", file.getOriginalFilename());

            byte[] imageBytes = file.getBytes();
            Media media = new Media(MimeTypeUtils.IMAGE_JPEG, imageBytes); // Assuming JPEG/PNG is passed

            String promptText = "Extract all line items, their prices, tax, and the total amount from this receipt image. " +
                    "Return the data STRICTLY as a JSON object with this exact structure: " +
                    "{ \"items\": [ {\"name\": \"item name\", \"price\": 10.50} ], \"tax\": 2.00, \"total\": 12.50, \"merchant\": \"merchant name\" }. " +
                    "Do not include markdown like ```json, just raw JSON.";

            UserMessage userMessage = new UserMessage(promptText, List.of(media));

            ChatResponse response = chatModel.call(new Prompt(List.of(userMessage)));
            String aiResponse = response.getResult().getOutput().getContent();

            // Clean up possible markdown
            if (aiResponse.startsWith("```json")) {
                aiResponse = aiResponse.substring(7);
                if (aiResponse.endsWith("```")) {
                    aiResponse = aiResponse.substring(0, aiResponse.length() - 3);
                }
            }

            return objectMapper.readValue(aiResponse.trim(), new TypeReference<Map<String, Object>>() {});

        } catch (Exception e) {
            log.error("Failed to scan receipt", e);
            throw new RuntimeException("Failed to scan receipt: " + e.getMessage());
        }
    }
}
