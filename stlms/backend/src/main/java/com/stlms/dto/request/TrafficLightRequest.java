package com.stlms.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record TrafficLightRequest(
        @NotBlank String name,
        @NotBlank String streetAddress,
        @NotNull Long intersectionId
) {}
