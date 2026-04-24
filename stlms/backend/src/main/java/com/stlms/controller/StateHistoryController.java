package com.stlms.controller;

import com.stlms.dto.response.StateTransitionResponse;
import com.stlms.service.StateTransitionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

/**
 * REST controller for querying state transition history and statistics.
 */
@RestController
@RequestMapping("/api/v1/history")
@Tag(name = "State History", description = "Query state transition history and statistics")
public class StateHistoryController {

    private final StateTransitionService stateTransitionService;

    public StateHistoryController(StateTransitionService stateTransitionService) {
        this.stateTransitionService = stateTransitionService;
    }

    @GetMapping
    @Operation(summary = "Get full transition history (paginated)")
    public ResponseEntity<Page<StateTransitionResponse>> findAll(
            @PageableDefault(size = 20) Pageable pageable) {
        return ResponseEntity.ok(stateTransitionService.findAll(pageable));
    }

    @GetMapping("/traffic-light/{id}")
    @Operation(summary = "Get transition history for a specific traffic light")
    public ResponseEntity<List<StateTransitionResponse>> findByTrafficLight(@PathVariable Long id) {
        return ResponseEntity.ok(stateTransitionService.findByTrafficLightId(id));
    }

    @GetMapping("/stats")
    @Operation(summary = "Get transition count grouped by target state")
    public ResponseEntity<Map<String, Long>> getStats() {
        return ResponseEntity.ok(stateTransitionService.getTransitionStats());
    }
}
