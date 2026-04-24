package com.stlms.pattern.state;

import com.stlms.pattern.context.TrafficLightContext;
import java.util.List;

/**
 * Concrete State: RED.
 *
 * <p>Vehicles must stop. Pedestrians may cross.
 * Normal next state is GREEN. Duration: 30 seconds.</p>
 */
public class RedLightState implements TrafficLightState {

    @Override
    public void handleNextState(TrafficLightContext context) {
        context.transitionTo(new GreenLightState(), "Normal cycle: RED → GREEN", "SYSTEM");
    }

    @Override
    public void handleEmergency(TrafficLightContext context) {
        context.transitionTo(new EmergencyState(), "Emergency vehicle detected", "EMERGENCY_SYSTEM");
    }

    @Override
    public void handleRestore(TrafficLightContext context) {
        // RED is already a normal state — no restoration needed
    }

    @Override
    public void handleMaintenance(TrafficLightContext context) {
        context.transitionTo(new OutOfServiceState(), "Scheduled maintenance", "OPERATOR");
    }

    @Override
    public String getStateName() { return "RED"; }

    @Override
    public String getColor() { return "#ef4444"; }

    @Override
    public int getDurationInSeconds() { return 30; }

    @Override
    public boolean isVehicleAllowedToProceed() { return false; }

    @Override
    public boolean isPedestrianAllowedToCross() { return true; }

    @Override
    public List<String> getAllowedTransitions() {
        return List.of("GREEN", "EMERGENCY", "OUT_OF_SERVICE");
    }
}
