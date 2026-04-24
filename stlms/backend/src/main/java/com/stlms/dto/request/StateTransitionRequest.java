package com.stlms.dto.request;

import jakarta.validation.constraints.Size;

/**
 * Request body for manually specifying the reason and operator for a state transition.
 * Both fields are optional — defaults are applied when blank.
 */
public record StateTransitionRequest(
        @Size(max = 255, message = "Reason must not exceed 255 characters")
        String reason,

        @Size(max = 100, message = "TriggeredBy must not exceed 100 characters")
        String triggeredBy
) {
    /** Applies default values when fields are null or blank. */
    public StateTransitionRequest {
        if (reason == null || reason.isBlank()) reason = "Manual operation";
        if (triggeredBy == null || triggeredBy.isBlank()) triggeredBy = "OPERATOR";
    }
}
