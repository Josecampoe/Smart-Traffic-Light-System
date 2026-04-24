package com.stlms.service;

import com.stlms.domain.enums.TrafficLightColor;
import com.stlms.domain.model.Intersection;
import com.stlms.domain.model.TrafficLight;
import com.stlms.dto.request.TrafficLightRequest;
import com.stlms.dto.response.TrafficLightResponse;
import com.stlms.exception.TrafficLightNotFoundException;
import com.stlms.repository.IntersectionRepository;
import com.stlms.repository.StateTransitionRepository;
import com.stlms.repository.TrafficLightRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TrafficLightServiceTest {

    @Mock private TrafficLightRepository trafficLightRepository;
    @Mock private IntersectionRepository intersectionRepository;
    @Mock private StateTransitionRepository stateTransitionRepository;

    private TrafficLightService trafficLightService;
    private Intersection intersection;
    private TrafficLight trafficLight;

    @BeforeEach
    void setUp() {
        trafficLightService = new TrafficLightService(
                trafficLightRepository, intersectionRepository, stateTransitionRepository);

        intersection = new Intersection("Test Intersection", "Test Location", "Test District");
        intersection.setId(1L);

        trafficLight = new TrafficLight("Test Light", "Test St 1", TrafficLightColor.RED, intersection);
        trafficLight.setId(1L);
    }

    @Test
    void shouldReturnAllTrafficLights() {
        when(trafficLightRepository.findAll()).thenReturn(List.of(trafficLight));

        List<TrafficLightResponse> result = trafficLightService.findAll();

        assertThat(result).hasSize(1);
        assertThat(result.get(0).currentState()).isEqualTo(TrafficLightColor.RED);
    }

    @Test
    void shouldCreateTrafficLightInRedState() {
        when(intersectionRepository.findById(1L)).thenReturn(Optional.of(intersection));
        when(trafficLightRepository.save(any())).thenAnswer(inv -> {
            TrafficLight saved = inv.getArgument(0);
            saved.setId(99L);
            return saved;
        });

        TrafficLightRequest request = new TrafficLightRequest("New Light", "New St", 1L);
        TrafficLightResponse response = trafficLightService.create(request);

        assertThat(response.currentState()).isEqualTo(TrafficLightColor.RED);
        assertThat(response.name()).isEqualTo("New Light");
    }

    @Test
    void shouldThrowNotFoundWhenLightDoesNotExist() {
        when(trafficLightRepository.findById(999L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> trafficLightService.findById(999L))
                .isInstanceOf(TrafficLightNotFoundException.class);
    }

    @Test
    void shouldAdvanceFromRedToGreen() {
        when(trafficLightRepository.findById(1L)).thenReturn(Optional.of(trafficLight));
        when(trafficLightRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));

        trafficLightService.advanceToNextState(1L);

        assertThat(trafficLight.getCurrentState()).isEqualTo(TrafficLightColor.GREEN);
    }

    @Test
    void shouldTriggerEmergencyFromAnyNormalState() {
        when(trafficLightRepository.findById(1L)).thenReturn(Optional.of(trafficLight));
        when(trafficLightRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));

        trafficLightService.triggerEmergency(1L);

        assertThat(trafficLight.getCurrentState()).isEqualTo(TrafficLightColor.EMERGENCY);
    }
}
