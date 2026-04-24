package com.stlms.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * OpenAPI / Swagger UI configuration for the STLMS REST API.
 */
@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI stlmsOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Smart Traffic Light Management System API")
                        .description("""
                                REST API for the STLMS — a State Design Pattern workshop project.
                                Manages traffic light states, intersections, and transition history.
                                
                                **States:** RED, GREEN, YELLOW, FLASHING_YELLOW, EMERGENCY, OUT_OF_SERVICE
                                """)
                        .version("1.0.0")
                        .contact(new Contact()
                                .name("STLMS Workshop")
                                .email("workshop@stlms.com"))
                        .license(new License()
                                .name("MIT")
                                .url("https://opensource.org/licenses/MIT")));
    }
}
