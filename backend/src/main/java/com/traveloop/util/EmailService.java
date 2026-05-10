package com.traveloop.util;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private static final Logger log = LoggerFactory.getLogger(EmailService.class);

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username:noreply@traveloop.com}")
    private String fromAddress;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    @Async
    public void sendWelcomeEmail(String toEmail, String fullName) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromAddress);
            message.setTo(toEmail);
            message.setSubject("Welcome to TravelLoop, " + fullName + "!");
            message.setText(
                "Hi " + fullName + ",\n\n" +
                "Welcome to TravelLoop! Your account has been created successfully.\n\n" +
                "Start planning your dream trip today:\n" +
                "- Create a personalized multi-city itinerary\n" +
                "- Discover activities and hidden gems\n" +
                "- Track your budget in real time\n" +
                "- Share your plans with friends\n\n" +
                "Happy traveling!\n" +
                "— The TravelLoop Team"
            );
            mailSender.send(message);
            log.info("Welcome email sent to {}", toEmail);
        } catch (Exception e) {
            log.warn("Failed to send welcome email to {}: {}", toEmail, e.getMessage());
        }
    }

    @Async
    public void sendTripSharedEmail(String toEmail, String sharedByName, String tripName, String shareLink) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromAddress);
            message.setTo(toEmail);
            message.setSubject(sharedByName + " shared a trip with you: " + tripName);
            message.setText(
                "Hi there!\n\n" +
                sharedByName + " has shared their trip \"" + tripName + "\" with you on TravelLoop.\n\n" +
                "View the itinerary here: " + shareLink + "\n\n" +
                "Happy traveling!\n" +
                "— The TravelLoop Team"
            );
            mailSender.send(message);
            log.info("Trip sharing email sent to {}", toEmail);
        } catch (Exception e) {
            log.warn("Failed to send trip sharing email to {}: {}", toEmail, e.getMessage());
        }
    }
}
