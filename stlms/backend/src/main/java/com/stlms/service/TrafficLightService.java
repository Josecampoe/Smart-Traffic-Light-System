package com.stlms.service;

import com.stlms.domain.enums.TrafficLightColor;
import com.stlms.domain.model.TrafficLight;
import com.stlms.dto.request.TrafficLightRequest;
import com.stlms.dto.response.TrafficLightResponse;
import com.stlms.exception.IntersectionNotFoundException;
import com.stlms.exception.TrafficLightNotFoundException;
import com.stlms.pattern.context.TrafficLightContext;
import com.stlms.pattern.state.TrafficLightState;
import com.stlms.repository.IntersectionRepository;
import com.stlms.repository.StateTransitionRepository;
import com.stlms.repository.TrafficLightRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Objects;

/**
 * Service layer for all traffic light operations.
 * Builds a {@link TrafficLightContext} for each state-changing operation to
 * delegate behavior to the appropriate concrete state object.
 *
 * <p>All read operations are marked {@code readOnly = true} for performance.
 * Write operations participate in the default read-write transaction.</p>
 */
@Service
public class TrafficLightService {

    private static final Logger log = LoggerFactory.getLogger(TrafficLightService.class);

    private final TrafficLightRepository trafficLightRepository;
    private final IntersectionRepository intersectionRepository;
    private final StateTransitionRepository stateTransitionRepository;

    public TrafficLightService(TrafficLightRepository trafficLightRepository,
                               IntersectionRepository intersectionRepository,
                               StateTransitionRepository stateTransitionRepository) {
        this.trafficLightRepository = trafficLightRepository;
        this.intersectionRepository = intersectionRepository;
        this.stateTransitionRepository = stateTransitionRepository;
    }

    // -------------------------------------------------------------------------
    // Read operations
    // -------------------------------------------------------------------------

    @Transactional(readOnly = true)
    public List<TrafficLightResponse> findAll() {
        log.debug("Fetching all traffic lights");
        return trafficLightRepository.findAll().stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public TrafficLightResponse findById(Long id) {
        log.debug("Fetching traffic light id={}", id);
        return toResponse(getOrThrow(id));
    }

    // -------------------------------------------------------------------------
    // Write operations
    // -------------------------------------------------------------------------

    @Transactional
    public TrafficLightResponse create(TrafficLightRequest request) {
        log.info("Creating traffic light '{}' at intersection id={}", request.name(), request.intersectionId());
        var intersection = intersectionRepository.findById(request.intersectionId())
                .orElseThrow(() -> new IntersectionNotFoundException(request.intersectionId()));

        var trafficLight = new TrafficLight(
                request.name(),
                request.streetAddress(),
                TrafficLightColor.RED,
                intersection
        );
        TrafficLight saved = trafficLightRepository.save(trafficLight);
        log.info("Created traffic light id={} in RED state", saved.getId());
        return toResponse(saved);
    }

    @Transactional
    public TrafficLightResponse advanceToNextState(Long id) {
        log.info("Advancing traffic light id={} to next state", id);
        TrafficLight trafficLight = getOrThrow(id);
        buildContext(trafficLight).nextState();
        return toResponse(getOrThrow(id));
    }

    @Transactional
    public TrafficLightResponse triggerEmergency(Long id) {
        log.warn("EMERGENCY triggered on traffic light id={}", id);
        TrafficLight trafficLight = getOrThrow(id);
        buildContext(trafficLight).triggerEmergency();
        return toResponse(getOrThrow(id));
    }

    @Transactional
    public TrafficLightResponse restore(Long id) {
        log.info("Restoring traffic light id={} from emergency/maintenance", id);
        TrafficLight trafficLight = getOrThrow(id);
        buildContext(trafficLight).restore();
        return toResponse(getOrThrow(id));
    }

    @Transactional
    public TrafficLightResponse triggerMaintenance(Long id) {
        log.info("Setting traffic light id={} to OUT_OF_SERVICE", id);
        TrafficLight trafficLight = getOrThrow(id);
        buildContext(trafficLight).triggerMaintenance();
        return toResponse(getOrThrow(id));
    }

    @Transactional
    public void delete(Long id) {
        log.info("Deleting traffic light id={}", id);
        if (!trafficLightRepository.existsById(id)) {
            throw new TrafficLightNotFoundException(id);
        }
        trafficLightRepository.deleteById(id);
    }

    // -------------------------------------------------------------------------
    // Helpers
    // -------------------------------------------------------------------------

    private TrafficLight getOrThrow(Long id) {
        return trafficLightRepository.findById(id)
                .orElseThrow(() -> new TrafficLightNotFoundException(id));
    }

    private TrafficLightContext buildContext(TrafficLight trafficLight) {
        return new TrafficLightContext(trafficLight, trafficLightRepository, stateTransitionRepository);
    }

    /**
     * Maps a {@link TrafficLight} entity to its API response DTO.
     * Resolves the current state object to populate behavior-derived fields
     * (color, duration, allowed transitions, etc.).
     *
     * @param trafficLight the entity to map; must not be null
     * @return the populated response DTO
     * @throws IllegalArgumentException if currentState is null
     */
    public TrafficLightResponse toResponse(TrafficLight trafficLight) {
        Objects.requireNonNull(trafficLight, "trafficLight must not be null");
        Objects.requireNonNull(trafficLight.getCurrentState(),
                "trafficLight.currentState must not be null for id=" + trafficLight.getId());

        TrafficLightState state = TrafficLightContext.resolveState(trafficLight.getCurrentState());

        String intersectionName = trafficLight.getIntersection() != null
                ? trafficLight.getIntersection().getName() : null;
        Long intersectionId = trafficLight.getIntersection() != null
                ? trafficLight.getIntersection().getId() : null;

        return new TrafficLightResponse(
                trafficLight.getId(),
                trafficLight.getName(),
                trafficLight.getStreetAddress(),
                trafficLight.getCurrentState(),
                trafficLight.getPreviousState(),
                intersectionId,
                intersectionName,
                state.getColor(),
                state.getDurationInSeconds(),
                state.isVehicleAllowedToProceed(),
                state.isPedestrianAllowedToCross(),
                state.getAllowedTransitions()
        );
    }
}
