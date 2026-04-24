package com.stlms.dto.response;

import java.util.List;

public record IntersectionResponse(
        Long id,
        String name,
        String location,
        String district,
        List<TrafficLightResponse> trafficLights
) {}
