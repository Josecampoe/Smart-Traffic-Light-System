package com.stlms.dto.response;

import com.stlms.domain.enums.TrafficLightColor;
import java.time.LocalDateTime;

public record StateTransitionResponse(
        Long id,
        Long trafficLightId,
        String trafficLightName,
        TrafficLightColor fromState,
        TrafficLightColor toState,
        LocalDateTime transitionTime,
        String reason,
        String triggeredBy
) {}
