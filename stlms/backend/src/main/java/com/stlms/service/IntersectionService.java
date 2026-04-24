package com.stlms.service;

import com.stlms.domain.model.Intersection;
import com.stlms.domain.model.TrafficLight;
import com.stlms.dto.request.IntersectionRequest;
import com.stlms.dto.response.IntersectionResponse;
import com.stlms.exception.IntersectionNotFoundException;
import com.stlms.pattern.context.TrafficLightContext;
import com.stlms.repository.IntersectionRepository;
import com.stlms.repository.StateTransitionRepository;
import com.stlms.repository.TrafficLightRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.List;

/**
 * Service layer for intersection management.
 * Supports intersection-level emergency that triggers all lights simultaneously.
 */
@Service
public class IntersectionService {

    private static final Logger log = LoggerFactory.getLogger(IntersectionService.class);

    private final IntersectionRepository intersectionRepository;
    private final TrafficLightRepository trafficLightRepository;
    private final StateTransitionRepository stateTransitionRepository;
    private final TrafficLightService trafficLightService;

    public IntersectionService(IntersectionRepository intersectionRepository,
                               TrafficLightRepository trafficLightRepository,
                               StateTransitionRepository stateTransitionRepository,
                               TrafficLightService trafficLightService) {
        this.intersectionRepository = intersectionRepository;
        this.trafficLightRepository = trafficLightRepository;
        this.stateTransitionRepository = stateTransitionRepository;
        this.trafficLightService = trafficLightService;
    }

    // -------------------------------------------------------------------------
    // Read operations
    // -------------------------------------------------------------------------

    @Transactional(readOnly = true)
    public List<IntersectionResponse> findAll() {
        log.debug("Fetching all intersections");
        return intersectionRepository.findAll().stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public IntersectionResponse findById(Long id) {
        log.debug("Fetching intersection id={}", id);
        return toResponse(getOrThrow(id));
    }

    // -------------------------------------------------------------------------
    // Write operations
    // -------------------------------------------------------------------------

    @Transactional
    public IntersectionResponse create(IntersectionRequest request) {
        log.info("Creating intersection '{}' at '{}'", request.name(), request.location());
        var intersection = new Intersection(request.name(), request.location(), request.district());
        return toResponse(intersectionRepository.save(intersection));
    }

    /**
     * Triggers EMERGENCY on every traffic light belonging to this intersection.
     * Domain rule: intersection-level emergency affects all lights simultaneously.
     * Lights already in EMERGENCY state are silently skipped by the state machine.
     *
     * @param intersectionId the intersection to put into emergency mode
     * @return updated intersection response with all lights in EMERGENCY state
     */
    @Transactional
    public IntersectionResponse triggerIntersectionEmergency(Long intersectionId) {
        log.warn("INTERSECTION EMERGENCY triggered for intersection id={}", intersectionId);
        getOrThrow(intersectionId); // validate existence before iterating

        List<TrafficLight> lights = trafficLightRepository.findByIntersectionId(intersectionId);
        log.info("Triggering emergency on {} traffic lights at intersection id={}", lights.size(), intersectionId);

        for (TrafficLight light : lights) {
            try {
                TrafficLightContext context = new TrafficLightContext(
                        light, trafficLightRepository, stateTransitionRepository);
                context.triggerEmergency();
            } catch (Exception ex) {
                // Log and continue — one light failing should not block the others
                log.error("Failed to trigger emergency on light id={}: {}", light.getId(), ex.getMessage());
            }
        }

        return toResponse(getOrThrow(intersectionId));
    }

    // -------------------------------------------------------------------------
    // Helpers
    // -------------------------------------------------------------------------

    private Intersection getOrThrow(Long id) {
        return intersectionRepository.findById(id)
                .orElseThrow(() -> new IntersectionNotFoundException(id));
    }

    private IntersectionResponse toResponse(Intersection intersection) {
        List<TrafficLight> lights = trafficLightRepository
                .findByIntersectionId(intersection.getId());

        return new IntersectionResponse(
                intersection.getId(),
                intersection.getName(),
                intersection.getLocation(),
                intersection.getDistrict(),
                lights.stream()
                        .map(trafficLightService::toResponse)
                        .toList()
        );
    }
}
