package com.stlms.pattern.state;

import com.stlms.pattern.context.TrafficLightContext;
import java.util.List;

/**
 * Concrete State: YELLOW.
 *
 * <p>Vehicles should prepare to stop. Caution for pedestrians.
 * Normal next state is RED. Duration: 5 seconds.</p>
 */
public class YellowLightState implements TrafficLightState {

    @Override
    public void handleNextState(TrafficLightContext context) {
        context.transitionTo(new RedLightState(), "Normal cycle: YELLOW → RED", "SYSTEM");
    }

    @Override
    public void handleEmergency(TrafficLightContext context) {
        context.transitionTo(new EmergencyState(), "Emergency vehicle detected", "EMERGENCY_SYSTEM");
    }

    @Override
    public void handleRestore(TrafficLightContext context) {
        // YELLOW is already a normal state — no restoration needed
    }

    @Override
    public void handleMaintenance(TrafficLightContext context) {
        context.transitionTo(new OutOfServiceState(), "Scheduled maintenance", "OPERATOR");
    }

    @Override
    public String getStateName() { return "YELLOW"; }

    @Override
    public String getColor() { return "#eab308"; }

    @Override
    public int getDurationInSeconds() { return 5; }

    @Override
    public boolean isVehicleAllowedToProceed() { return false; }

    @Override
    public boolean isPedestrianAllowedToCross() { return false; }

    @Override
    public List<String> getAllowedTransitions() {
        return List.of("RED", "EMERGENCY", "OUT_OF_SERVICE");
    }
}
