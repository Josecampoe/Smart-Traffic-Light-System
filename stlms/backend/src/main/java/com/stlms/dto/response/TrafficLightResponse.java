package com.stlms.dto.response;

import com.stlms.domain.enums.TrafficLightColor;
import java.util.List;

public record TrafficLightResponse(
        Long id,
        String name,
        String streetAddress,
        TrafficLightColor currentState,
        TrafficLightColor previousState,
        Long intersectionId,
        String intersectionName,
        String color,
        int durationInSeconds,
        boolean vehicleAllowedToProceed,
        boolean pedestrianAllowedToCross,
        List<String> allowedTransitions
) {}
