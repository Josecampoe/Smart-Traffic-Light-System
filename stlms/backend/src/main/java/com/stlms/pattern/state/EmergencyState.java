package com.stlms.pattern.state;

import com.stlms.pattern.context.TrafficLightContext;
import java.util.List;

/**
 * Concrete State: EMERGENCY.
 *
 * <p>All vehicle and pedestrian movement is halted to allow emergency vehicles
 * to pass safely. The light remains in this state until explicitly restored.
 * Upon restoration, the light returns to the exact state it was in before
 * the emergency was triggered (stored in the context as previousState).</p>
 */
public class EmergencyState implements TrafficLightState {

    @Override
    public void handleNextState(TrafficLightContext context) {
        // Cannot advance normally during an emergency — must use restore
    }

    @Override
    public void handleEmergency(TrafficLightContext context) {
        // Already in emergency — no action needed
    }

    @Override
    public void handleRestore(TrafficLightContext context) {
        TrafficLightState stateBeforeEmergency = context.getPreEmergencyState();
        if (stateBeforeEmergency != null) {
            context.transitionTo(stateBeforeEmergency, "Emergency cleared — restoring previous state", "OPERATOR");
        } else {
            context.transitionTo(new RedLightState(), "Emergency cleared — defaulting to RED", "OPERATOR");
        }
    }

    @Override
    public void handleMaintenance(TrafficLightContext context) {
        context.transitionTo(new OutOfServiceState(), "Maintenance requested during emergency", "OPERATOR");
    }

    @Override
    public String getStateName() { return "EMERGENCY"; }

    @Override
    public String getColor() { return "#dc2626"; }

    @Override
    public int getDurationInSeconds() { return -1; }

    @Override
    public boolean isVehicleAllowedToProceed() { return false; }

    @Override
    public boolean isPedestrianAllowedToCross() { return false; }

    @Override
    public List<String> getAllowedTransitions() {
        return List.of("RED", "GREEN", "YELLOW", "FLASHING_YELLOW", "OUT_OF_SERVICE");
    }
}
