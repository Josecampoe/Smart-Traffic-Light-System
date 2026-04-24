package com.stlms.pattern.state;

import com.stlms.pattern.context.TrafficLightContext;
import java.util.List;

/**
 * Concrete State: GREEN.
 *
 * <p>Vehicles may proceed. Pedestrians must wait.
 * Normal next state is YELLOW. Duration: 45 seconds.</p>
 */
public class GreenLightState implements TrafficLightState {

    @Override
    public void handleNextState(TrafficLightContext context) {
        context.transitionTo(new YellowLightState(), "Normal cycle: GREEN → YELLOW", "SYSTEM");
    }

    @Override
    public void handleEmergency(TrafficLightContext context) {
        context.transitionTo(new EmergencyState(), "Emergency vehicle detected", "EMERGENCY_SYSTEM");
    }

    @Override
    public void handleRestore(TrafficLightContext context) {
        // GREEN is already a normal state — no restoration needed
    }

    @Override
    public void handleMaintenance(TrafficLightContext context) {
        context.transitionTo(new OutOfServiceState(), "Scheduled maintenance", "OPERATOR");
    }

    @Override
    public String getStateName() { return "GREEN"; }

    @Override
    public String getColor() { return "#22c55e"; }

    @Override
    public int getDurationInSeconds() { return 45; }

    @Override
    public boolean isVehicleAllowedToProceed() { return true; }

    @Override
    public boolean isPedestrianAllowedToCross() { return false; }

    @Override
    public List<String> getAllowedTransitions() {
        return List.of("YELLOW", "EMERGENCY", "OUT_OF_SERVICE");
    }
}
