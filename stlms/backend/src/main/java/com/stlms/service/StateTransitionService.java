package com.stlms.service;

import com.stlms.domain.enums.TrafficLightColor;
import com.stlms.domain.model.StateTransition;
import com.stlms.dto.response.StateTransitionResponse;
import com.stlms.repository.StateTransitionRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * Service for querying state transition history and statistics.
 * All operations are read-only — transitions are written by {@link TrafficLightContext}.
 */
@Service
@Transactional(readOnly = true)
public class StateTransitionService {

    private static final Logger log = LoggerFactory.getLogger(StateTransitionService.class);

    private final StateTransitionRepository stateTransitionRepository;

    public StateTransitionService(StateTransitionRepository stateTransitionRepository) {
        this.stateTransitionRepository = stateTransitionRepository;
    }

    /**
     * Returns a paginated list of all state transitions, ordered by most recent first.
     *
     * @param pageable pagination parameters
     * @return page of transition response DTOs
     */
    public Page<StateTransitionResponse> findAll(Pageable pageable) {
        log.debug("Fetching transition history page={}", pageable.getPageNumber());
        return stateTransitionRepository.findAllByOrderByTransitionTimeDesc(pageable)
                .map(this::toResponse);
    }

    /**
     * Returns the full transition history for a specific traffic light,
     * ordered by most recent first.
     *
     * @param trafficLightId the traffic light to query
     * @return list of transition response DTOs
     */
    public List<StateTransitionResponse> findByTrafficLightId(Long trafficLightId) {
        log.debug("Fetching transition history for traffic light id={}", trafficLightId);
        return stateTransitionRepository
                .findByTrafficLightIdOrderByTransitionTimeDesc(trafficLightId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    /**
     * Returns a map of {@code stateName → transitionCount} for dashboard statistics.
     * The map is ordered by insertion (i.e., query result order).
     *
     * @return state name to count map
     */
    public Map<String, Long> getTransitionStats() {
        log.debug("Computing transition statistics");
        List<Object[]> results = stateTransitionRepository.countTransitionsGroupedByTargetState();
        Map<String, Long> stats = new LinkedHashMap<>();
        for (Object[] row : results) {
            TrafficLightColor state = (TrafficLightColor) row[0];
            Long count = (Long) row[1];
            stats.put(state.name(), count);
        }
        return stats;
    }

    // -------------------------------------------------------------------------
    // Helpers
    // -------------------------------------------------------------------------

    private StateTransitionResponse toResponse(StateTransition transition) {
        return new StateTransitionResponse(
                transition.getId(),
                transition.getTrafficLightId(),
                transition.getTrafficLightName(),
                transition.getFromState(),
                transition.getToState(),
                transition.getTransitionTime(),
                transition.getReason(),
                transition.getTriggeredBy()
        );
    }
}
