package com.traveloop.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenAPIConfig {

    @Bean
    public OpenAPI traveloopOpenAPI() {
        String schemeName = "BearerAuth";
        return new OpenAPI()
                .info(new Info()
                        .title("TravelLoop API")
                        .description("Personalized Travel Planning Platform — REST API Documentation")
                        .version("1.0.0")
                        .contact(new Contact()
                                .name("Animesh & Kajol")
                                .url("https://github.com/Animesh-86/TravelLoop")))
                .addSecurityItem(new SecurityRequirement().addList(schemeName))
                .components(new Components()
                        .addSecuritySchemes(schemeName,
                                new SecurityScheme()
                                        .name(schemeName)
                                        .type(SecurityScheme.Type.HTTP)
                                        .scheme("bearer")
                                        .bearerFormat("JWT")));
    }
}
