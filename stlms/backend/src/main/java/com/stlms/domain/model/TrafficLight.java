package com.stlms.domain.model;

import com.stlms.domain.enums.TrafficLightColor;
import jakarta.persistence.*;

/**
 * JPA entity representing a physical traffic light at an intersection.
 * The current state is stored as a {@link TrafficLightColor} enum.
 * The pre-emergency/pre-maintenance state is persisted to support restoration.
 */
@Entity
@Table(name = "traffic_lights")
public class TrafficLight {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(name = "street_address")
    private String streetAddress;

    @Enumerated(EnumType.STRING)
    @Column(name = "current_state", nullable = false)
    private TrafficLightColor currentState;

    @Enumerated(EnumType.STRING)
    @Column(name = "previous_state")
    private TrafficLightColor previousState;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "intersection_id")
    private Intersection intersection;

    public TrafficLight() {}

    public TrafficLight(String name, String streetAddress, TrafficLightColor currentState, Intersection intersection) {
        this.name = name;
        this.streetAddress = streetAddress;
        this.currentState = currentState;
        this.intersection = intersection;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getStreetAddress() { return streetAddress; }
    public void setStreetAddress(String streetAddress) { this.streetAddress = streetAddress; }

    public TrafficLightColor getCurrentState() { return currentState; }
    public void setCurrentState(TrafficLightColor currentState) { this.currentState = currentState; }

    public TrafficLightColor getPreviousState() { return previousState; }
    public void setPreviousState(TrafficLightColor previousState) { this.previousState = previousState; }

    public Intersection getIntersection() { return intersection; }
    public void setIntersection(Intersection intersection) { this.intersection = intersection; }
}
