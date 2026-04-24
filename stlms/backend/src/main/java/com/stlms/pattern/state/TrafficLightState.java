package com.stlms.pattern.state;

import com.stlms.pattern.context.TrafficLightContext;
import java.util.List;

/**
 * State Pattern — State Interface.
 *
 * <p>Defines the contract that every concrete traffic light state must fulfill.
 * Each implementation encapsulates the behavior specific to one operational state,
 * eliminating the need for conditional chains in the context class.</p>
 *
 * <p>The context delegates all behavior calls to the current state object,
 * which decides how to handle each action and which state to transition to next.</p>
 */
public interface TrafficLightState {

    /**
     * Advances the traffic light to its natural next state in the normal cycle.
     * (e.g., GREEN → YELLOW → RED → GREEN)
     *
     * @param context the traffic light context that holds this state
     */
    void handleNextState(TrafficLightContext context);

    /**
     * Handles an emergency vehicle trigger. Most states transition to EMERGENCY.
     *
     * @param context the traffic light context
     */
    void handleEmergency(TrafficLightContext context);

    /**
     * Restores the light from EMERGENCY or OUT_OF_SERVICE back to normal operation.
     *
     * @param context the traffic light context
     */
    void handleRestore(TrafficLightContext context);

    /**
     * Puts the light into OUT_OF_SERVICE (maintenance) mode.
     *
     * @param context the traffic light context
     */
    void handleMaintenance(TrafficLightContext context);

    /**
     * Returns the canonical name of this state (e.g., "RED", "GREEN").
     *
     * @return state name string
     */
    String getStateName();

    /**
     * Returns the hex color code associated with this state for UI rendering.
     *
     * @return hex color string (e.g., "#ef4444")
     */
    String getColor();

    /**
     * Returns how long this state should remain active, in seconds.
     * Returns -1 for states with indefinite duration (EMERGENCY, OUT_OF_SERVICE).
     *
     * @return duration in seconds, or -1 for indefinite
     */
    int getDurationInSeconds();

    /**
     * Indicates whether vehicles are allowed to proceed through the intersection.
     *
     * @return true if vehicles may proceed
     */
    boolean isVehicleAllowedToProceed();

    /**
     * Indicates whether pedestrians are allowed to cross the intersection.
     *
     * @return true if pedestrians may cross
     */
    boolean isPedestrianAllowedToCross();

    /**
     * Returns the list of state names that this state is allowed to transition to.
     * The context uses this list to validate transitions before executing them.
     *
     * @return list of allowed target state names
     */
    List<String> getAllowedTransitions();
}
