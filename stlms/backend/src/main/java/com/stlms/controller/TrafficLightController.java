package com.stlms.controller;

import com.stlms.dto.request.TrafficLightRequest;
import com.stlms.dto.response.TrafficLightResponse;
import com.stlms.service.TrafficLightService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

/**
 * REST controller for traffic light CRUD and state transition operations.
 * All business logic is delegated to {@link TrafficLightService}.
 */
@RestController
@RequestMapping("/api/v1/traffic-lights")
@Tag(name = "Traffic Lights", description = "Manage traffic lights and trigger state transitions")
public class TrafficLightController {

    private final TrafficLightService trafficLightService;

    public TrafficLightController(TrafficLightService trafficLightService) {
        this.trafficLightService = trafficLightService;
    }

    @GetMapping
    @Operation(summary = "List all traffic lights")
    public ResponseEntity<List<TrafficLightResponse>> findAll() {
        return ResponseEntity.ok(trafficLightService.findAll());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get a traffic light by ID")
    public ResponseEntity<TrafficLightResponse> findById(@PathVariable Long id) {
        return ResponseEntity.ok(trafficLightService.findById(id));
    }

    @PostMapping
    @Operation(summary = "Create a new traffic light (starts in RED)")
    public ResponseEntity<TrafficLightResponse> create(@Valid @RequestBody TrafficLightRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(trafficLightService.create(request));
    }

    @PatchMapping("/{id}/next")
    @Operation(summary = "Advance to the next state in the normal cycle")
    public ResponseEntity<TrafficLightResponse> nextState(@PathVariable Long id) {
        return ResponseEntity.ok(trafficLightService.advanceToNextState(id));
    }

    @PatchMapping("/{id}/emergency")
    @Operation(summary = "Trigger emergency mode — halts all traffic")
    public ResponseEntity<TrafficLightResponse> triggerEmergency(@PathVariable Long id) {
        return ResponseEntity.ok(trafficLightService.triggerEmergency(id));
    }

    @PatchMapping("/{id}/restore")
    @Operation(summary = "Restore from EMERGENCY (returns to pre-emergency state) or OUT_OF_SERVICE (returns to RED)")
    public ResponseEntity<TrafficLightResponse> restore(@PathVariable Long id) {
        return ResponseEntity.ok(trafficLightService.restore(id));
    }

    @PatchMapping("/{id}/maintenance")
    @Operation(summary = "Set traffic light to OUT_OF_SERVICE for maintenance")
    public ResponseEntity<TrafficLightResponse> triggerMaintenance(@PathVariable Long id) {
        return ResponseEntity.ok(trafficLightService.triggerMaintenance(id));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a traffic light")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        trafficLightService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
