package com.stlms.domain.model;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

/**
 * Represents a city intersection that contains one or more traffic lights.
 * An intersection can trigger emergency mode on all its lights simultaneously.
 */
@Entity
@Table(name = "intersections")
public class Intersection {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String location;

    @Column(name = "district")
    private String district;

    @OneToMany(mappedBy = "intersection", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<TrafficLight> trafficLights = new ArrayList<>();

    public Intersection() {}

    public Intersection(String name, String location, String district) {
        this.name = name;
        this.location = location;
        this.district = district;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public String getDistrict() { return district; }
    public void setDistrict(String district) { this.district = district; }

    public List<TrafficLight> getTrafficLights() { return trafficLights; }
    public void setTrafficLights(List<TrafficLight> trafficLights) { this.trafficLights = trafficLights; }
}
