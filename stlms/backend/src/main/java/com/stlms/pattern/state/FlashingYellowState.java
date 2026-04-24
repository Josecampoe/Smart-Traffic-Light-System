package com.stlms.pattern.state;

import com.stlms.pattern.context.TrafficLightContext;
import java.util.List;

/**
 * Concrete State: FLASHING_YELLOW.
 *
 * <p>Caution mode used during low-traffic hours (e.g., late night).
 * All directions flash yellow — drivers must yield but may proceed.
 * Duration is indefinite until manually changed. No emergency override
 * (the light is already in a reduced-operation mode).</p>
 */
public class FlashingYellowState implements TrafficLightState {

    @Override
    public void handleNextState(TrafficLightContext context) {
        context.transitionTo(new RedLightState(), "Resuming normal cycle from flashing mode", "OPERATOR");
    }

    @Override
    public void handleEmergency(TrafficLightContext context) {
        context.transitionTo(new EmergencyState(), "Emergency vehicle detected during flashing mode", "EMERGENCY_SYSTEM");
    }

    @Override
    public void handleRestore(TrafficLightContext context) {
        // FLASHING_YELLOW is a normal operational state — no restoration needed
    }

    @Override
    public void handleMaintenance(TrafficLightContext context) {
        context.transitionTo(new OutOfServiceState(), "Scheduled maintenance", "OPERATOR");
    }

    @Override
    public String getStateName() { return "FLASHING_YELLOW"; }

    @Override
    public String getColor() { return "#f59e0b"; }

    @Override
    public int getDurationInSeconds() { return -1; }

    @Override
    public boolean isVehicleAllowedToProceed() { return true; }

    @Override
    public boolean isPedestrianAllowedToCross() { return true; }

    @Override
    public List<String> getAllowedTransitions() {
        return List.of("RED", "EMERGENCY", "OUT_OF_SERVICE");
    }
}
