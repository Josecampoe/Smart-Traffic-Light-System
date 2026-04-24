package com.stlms.pattern.context;

import com.stlms.domain.enums.TrafficLightColor;
import com.stlms.domain.model.StateTransition;
import com.stlms.domain.model.TrafficLight;
import com.stlms.exception.InvalidStateTransitionException;
import com.stlms.pattern.state.*;
import com.stlms.repository.StateTransitionRepository;
import com.stlms.repository.TrafficLightRepository;

/**
 * State Pattern — Context Class.
 *
 * <p>The TrafficLightContext is the central object that clients interact with.
 * It holds a reference to the current {@link TrafficLightState} and delegates
 * all behavior calls to it. The context itself contains NO conditional logic
 * about states — all decisions are made by the state objects themselves.</p>
 *
 * <p>Responsibilities:
 * <ul>
 *   <li>Maintain the current state reference</li>
 *   <li>Delegate action calls to the current state</li>
 *   <li>Validate transitions against the allowed list</li>
 *   <li>Persist state changes to the database</li>
 *   <li>Log every transition as a {@link StateTransition} audit record</li>
 *   <li>Store the pre-emergency state for restoration</li>
 * </ul>
 * </p>
 */
public class TrafficLightContext {

    private TrafficLightState currentState;
    private TrafficLightState preEmergencyState;

    private final TrafficLight trafficLight;
    private final TrafficLightRepository trafficLightRepository;
    private final StateTransitionRepository stateTransitionRepository;

    public TrafficLightContext(TrafficLight trafficLight,
                               TrafficLightRepository trafficLightRepository,
                               StateTransitionRepository stateTransitionRepository) {
        this.trafficLight = trafficLight;
        this.trafficLightRepository = trafficLightRepository;
        this.stateTransitionRepository = stateTransitionRepository;
        this.currentState = resolveState(trafficLight.getCurrentState());
    }

    // -------------------------------------------------------------------------
    // Public action methods — delegated to the current state
    // -------------------------------------------------------------------------

    /** Advances to the next state in the normal traffic cycle. */
    public void nextState() {
        currentState.handleNextState(this);
    }

    /** Triggers emergency mode — saves current state for later restoration. */
    public void triggerEmergency() {
        if (!(currentState instanceof EmergencyState)) {
            preEmergencyState = currentState;
        }
        currentState.handleEmergency(this);
    }

    /** Restores the light from EMERGENCY or OUT_OF_SERVICE. */
    public void restore() {
        currentState.handleRestore(this);
    }

    /** Puts the light into OUT_OF_SERVICE (maintenance) mode. */
    public void triggerMaintenance() {
        currentState.handleMaintenance(this);
    }

    // -------------------------------------------------------------------------
    // Transition execution — called by state objects
    // -------------------------------------------------------------------------

    /**
     * Executes a state transition. Called by concrete state implementations.
     * Validates the transition, updates the entity, and logs the audit record.
     *
     * @param newState    the target state to transition to
     * @param reason      human-readable reason for the transition
     * @param triggeredBy identifier of who/what triggered the transition
     * @throws InvalidStateTransitionException if the transition is not allowed
     */
    public void transitionTo(TrafficLightState newState, String reason, String triggeredBy) {
        String targetStateName = newState.getStateName();

        if (!currentState.getAllowedTransitions().contains(targetStateName)) {
            throw new InvalidStateTransitionException(
                    trafficLight.getId(),
                    currentState.getStateName(),
                    targetStateName
            );
        }

        TrafficLightColor fromColor = trafficLight.getCurrentState();
        TrafficLightColor toColor = TrafficLightColor.valueOf(targetStateName);

        // Persist the transition audit record
        StateTransition transition = new StateTransition(
                trafficLight.getId(),
                trafficLight.getName(),
                fromColor,
                toColor,
                reason,
                triggeredBy
        );
        stateTransitionRepository.save(transition);

        // Update the entity
        trafficLight.setPreviousState(fromColor);
        trafficLight.setCurrentState(toColor);
        trafficLightRepository.save(trafficLight);

        // Update the in-memory state
        this.currentState = newState;
    }

    // -------------------------------------------------------------------------
    // Accessors
    // -------------------------------------------------------------------------

    public TrafficLightState getCurrentState() {
        return currentState;
    }

    public TrafficLightState getPreEmergencyState() {
        return preEmergencyState;
    }

    public TrafficLight getTrafficLight() {
        return trafficLight;
    }

    // -------------------------------------------------------------------------
    // State resolution — maps enum to concrete state object
    // -------------------------------------------------------------------------

    /**
     * Resolves a {@link TrafficLightColor} enum value to its corresponding
     * concrete {@link TrafficLightState} implementation.
     *
     * @param color the stored enum value
     * @return the matching state object
     */
    public static TrafficLightState resolveState(TrafficLightColor color) {
        return switch (color) {
            case RED -> new RedLightState();
            case GREEN -> new GreenLightState();
            case YELLOW -> new YellowLightState();
            case FLASHING_YELLOW -> new FlashingYellowState();
            case EMERGENCY -> new EmergencyState();
            case OUT_OF_SERVICE -> new OutOfServiceState();
        };
    }
}
