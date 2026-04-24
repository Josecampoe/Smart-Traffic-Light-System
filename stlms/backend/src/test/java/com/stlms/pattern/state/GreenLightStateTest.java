package com.stlms.pattern.state;

import com.stlms.domain.enums.TrafficLightColor;
import com.stlms.domain.model.Intersection;
import com.stlms.domain.model.TrafficLight;
import com.stlms.pattern.context.TrafficLightContext;
import com.stlms.repository.StateTransitionRepository;
import com.stlms.repository.TrafficLightRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.junit.jupiter.MockitoSettings;
import org.mockito.quality.Strictness;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
@MockitoSettings(strictness = Strictness.LENIENT)
class GreenLightStateTest {

    @Mock
    private TrafficLightRepository trafficLightRepository;

    @Mock
    private StateTransitionRepository stateTransitionRepository;

    private TrafficLight trafficLight;

    @BeforeEach
    void setUp() {
        Intersection intersection = new Intersection("Test", "Test St", "Test District");
        trafficLight = new TrafficLight("Test Light", "Test St 1", TrafficLightColor.GREEN, intersection);
        trafficLight.setId(1L);

        when(trafficLightRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));
        when(trafficLightRepository.findById(1L)).thenReturn(Optional.of(trafficLight));
    }

    @Test
    void shouldHaveCorrectProperties() {
        GreenLightState state = new GreenLightState();
        assertThat(state.getStateName()).isEqualTo("GREEN");
        assertThat(state.getColor()).isEqualTo("#22c55e");
        assertThat(state.getDurationInSeconds()).isEqualTo(45);
        assertThat(state.isVehicleAllowedToProceed()).isTrue();
        assertThat(state.isPedestrianAllowedToCross()).isFalse();
        assertThat(state.getAllowedTransitions()).containsExactlyInAnyOrder("YELLOW", "EMERGENCY", "OUT_OF_SERVICE");
    }

    @Test
    void shouldTransitionToYellowOnNextState() {
        TrafficLightContext context = new TrafficLightContext(trafficLight, trafficLightRepository, stateTransitionRepository);
        context.nextState();
        assertThat(trafficLight.getCurrentState()).isEqualTo(TrafficLightColor.YELLOW);
    }

    @Test
    void shouldTransitionToEmergencyOnEmergency() {
        TrafficLightContext context = new TrafficLightContext(trafficLight, trafficLightRepository, stateTransitionRepository);
        context.triggerEmergency();
        assertThat(trafficLight.getCurrentState()).isEqualTo(TrafficLightColor.EMERGENCY);
    }
}
