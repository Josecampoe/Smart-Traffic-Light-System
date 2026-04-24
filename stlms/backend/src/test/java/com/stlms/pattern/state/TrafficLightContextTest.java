package com.stlms.pattern.state;

import com.stlms.domain.enums.TrafficLightColor;
import com.stlms.domain.model.Intersection;
import com.stlms.domain.model.TrafficLight;
import com.stlms.exception.InvalidStateTransitionException;
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
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
@MockitoSettings(strictness = Strictness.LENIENT)
class TrafficLightContextTest {

    @Mock
    private TrafficLightRepository trafficLightRepository;

    @Mock
    private StateTransitionRepository stateTransitionRepository;

    private TrafficLight trafficLight;

    @BeforeEach
    void setUp() {
        Intersection intersection = new Intersection("Test", "Test St", "Test District");
        trafficLight = new TrafficLight("Test Light", "Test St 1", TrafficLightColor.RED, intersection);
        trafficLight.setId(1L);

        when(trafficLightRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));
        when(trafficLightRepository.findById(1L)).thenReturn(Optional.of(trafficLight));
    }

    @Test
    void shouldFollowNormalCycle() {
        TrafficLightContext context = new TrafficLightContext(trafficLight, trafficLightRepository, stateTransitionRepository);

        context.nextState(); // RED → GREEN
        assertThat(trafficLight.getCurrentState()).isEqualTo(TrafficLightColor.GREEN);

        context.nextState(); // GREEN → YELLOW
        assertThat(trafficLight.getCurrentState()).isEqualTo(TrafficLightColor.YELLOW);

        context.nextState(); // YELLOW → RED
        assertThat(trafficLight.getCurrentState()).isEqualTo(TrafficLightColor.RED);
    }

    @Test
    void shouldRestoreToPreEmergencyState() {
        // Start at GREEN
        trafficLight.setCurrentState(TrafficLightColor.GREEN);
        TrafficLightContext context = new TrafficLightContext(trafficLight, trafficLightRepository, stateTransitionRepository);

        context.triggerEmergency(); // GREEN → EMERGENCY (saves GREEN as pre-emergency)
        assertThat(trafficLight.getCurrentState()).isEqualTo(TrafficLightColor.EMERGENCY);

        context.restore(); // EMERGENCY → GREEN (restores pre-emergency state)
        assertThat(trafficLight.getCurrentState()).isEqualTo(TrafficLightColor.GREEN);
    }

    @Test
    void shouldAlwaysRestoreFromOutOfServiceToRed() {
        trafficLight.setCurrentState(TrafficLightColor.OUT_OF_SERVICE);
        TrafficLightContext context = new TrafficLightContext(trafficLight, trafficLightRepository, stateTransitionRepository);

        context.restore(); // OUT_OF_SERVICE → RED (always, never to previous state)
        assertThat(trafficLight.getCurrentState()).isEqualTo(TrafficLightColor.RED);
    }

    @Test
    void shouldThrowExceptionForInvalidTransition() {
        // RED cannot go directly to YELLOW
        TrafficLightContext context = new TrafficLightContext(trafficLight, trafficLightRepository, stateTransitionRepository);

        assertThatThrownBy(() ->
                context.transitionTo(new YellowLightState(), "Invalid", "TEST")
        ).isInstanceOf(InvalidStateTransitionException.class)
         .hasMessageContaining("RED")
         .hasMessageContaining("YELLOW");
    }

    @Test
    void shouldSavePreEmergencyStateBeforeTransition() {
        trafficLight.setCurrentState(TrafficLightColor.YELLOW);
        TrafficLightContext context = new TrafficLightContext(trafficLight, trafficLightRepository, stateTransitionRepository);

        context.triggerEmergency();

        assertThat(context.getPreEmergencyState()).isInstanceOf(YellowLightState.class);
    }
}
