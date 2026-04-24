package com.stlms.dto.request;

import jakarta.validation.constraints.NotBlank;

public record IntersectionRequest(
        @NotBlank String name,
        @NotBlank String location,
        String district
) {}
