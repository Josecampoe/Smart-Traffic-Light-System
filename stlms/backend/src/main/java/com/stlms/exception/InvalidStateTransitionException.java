package com.stlms.exception;

/**
 * Thrown when a requested state transition is not permitted by the current state's
 * allowed transitions list. This enforces the domain rule that state changes must
 * follow the defined transition graph.
 */
public class InvalidStateTransitionException extends RuntimeException {

    private final Long trafficLightId;
    private final String fromState;
    private final String toState;

    public InvalidStateTransitionException(Long trafficLightId, String fromState, String toState) {
        super(String.format(
                "Traffic light [id=%d] cannot transition from [%s] to [%s]",
                trafficLightId, fromState, toState
        ));
        this.trafficLightId = trafficLightId;
        this.fromState = fromState;
        this.toState = toState;
    }

    public Long getTrafficLightId() { return trafficLightId; }
    public String getFromState() { return fromState; }
    public String getToState() { return toState; }
}
