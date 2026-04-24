package com.stlms.controller;

import com.stlms.dto.request.IntersectionRequest;
import com.stlms.dto.response.IntersectionResponse;
import com.stlms.service.IntersectionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

/**
 * REST controller for intersection management.
 */
@RestController
@RequestMapping("/api/v1/intersections")
@Tag(name = "Intersections", description = "Manage intersections and trigger intersection-wide emergencies")
public class IntersectionController {

    private final IntersectionService intersectionService;

    public IntersectionController(IntersectionService intersectionService) {
        this.intersectionService = intersectionService;
    }

    @GetMapping
    @Operation(summary = "List all intersections with their traffic lights")
    public ResponseEntity<List<IntersectionResponse>> findAll() {
        return ResponseEntity.ok(intersectionService.findAll());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get intersection detail by ID")
    public ResponseEntity<IntersectionResponse> findById(@PathVariable Long id) {
        return ResponseEntity.ok(intersectionService.findById(id));
    }

    @PostMapping
    @Operation(summary = "Create a new intersection")
    public ResponseEntity<IntersectionResponse> create(@Valid @RequestBody IntersectionRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(intersectionService.create(request));
    }

    @PatchMapping("/{id}/emergency")
    @Operation(summary = "Trigger EMERGENCY on ALL traffic lights at this intersection simultaneously")
    public ResponseEntity<IntersectionResponse> triggerEmergency(@PathVariable Long id) {
        return ResponseEntity.ok(intersectionService.triggerIntersectionEmergency(id));
    }
}
