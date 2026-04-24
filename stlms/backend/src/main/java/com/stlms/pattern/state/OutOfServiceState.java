package com.stlms.pattern.state;

import com.stlms.pattern.context.TrafficLightContext;
import java.util.List;

/**
 * Concrete State: OUT_OF_SERVICE.
 *
 * <p>The traffic light is offline due to malfunction or scheduled maintenance.
 * No signals are displayed. Restoration always goes to RED first (never to the
 * previous state) to ensure a safe restart sequence.</p>
 */
public class OutOfServiceState implements TrafficLightState {

    @Override
    public void handleNextState(TrafficLightContext context) {
        // Cannot advance while out of service — must use restore
    }

    @Override
    public void handleEmergency(TrafficLightContext context) {
        // Already offline — emergency has no additional effect
    }

    @Override
    public void handleRestore(TrafficLightContext context) {
        // Domain rule: OUT_OF_SERVICE always restores to RED first, never to previous state
        context.transitionTo(new RedLightState(), "Maintenance complete — restoring to RED", "OPERATOR");
    }

    @Override
    public void handleMaintenance(TrafficLightContext context) {
        // Already out of service — no action needed
    }

    @Override
    public String getStateName() { return "OUT_OF_SERVICE"; }

    @Override
    public String getColor() { return "#6b7280"; }

    @Override
    public int getDurationInSeconds() { return -1; }

    @Override
    public boolean isVehicleAllowedToProceed() { return false; }

    @Override
    public boolean isPedestrianAllowedToCross() { return false; }

    @Override
    public List<String> getAllowedTransitions() {
        return List.of("RED");
    }
}
