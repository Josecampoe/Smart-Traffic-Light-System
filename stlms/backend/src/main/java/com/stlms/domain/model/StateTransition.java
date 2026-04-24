package com.stlms.domain.model;

import com.stlms.domain.enums.TrafficLightColor;
import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * Audit record of every state transition that occurs on a traffic light.
 * Captures who triggered it, why, and when.
 */
@Entity
@Table(name = "state_transitions")
public class StateTransition {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "traffic_light_id", nullable = false)
    private Long trafficLightId;

    @Column(name = "traffic_light_name")
    private String trafficLightName;

    @Enumerated(EnumType.STRING)
    @Column(name = "from_state", nullable = false)
    private TrafficLightColor fromState;

    @Enumerated(EnumType.STRING)
    @Column(name = "to_state", nullable = false)
    private TrafficLightColor toState;

    @Column(name = "transition_time", nullable = false)
    private LocalDateTime transitionTime;

    @Column(name = "reason")
    private String reason;

    @Column(name = "triggered_by")
    private String triggeredBy;

    public StateTransition() {}

    public StateTransition(Long trafficLightId, String trafficLightName,
                           TrafficLightColor fromState, TrafficLightColor toState,
                           String reason, String triggeredBy) {
        this.trafficLightId = trafficLightId;
        this.trafficLightName = trafficLightName;
        this.fromState = fromState;
        this.toState = toState;
        this.transitionTime = LocalDateTime.now();
        this.reason = reason;
        this.triggeredBy = triggeredBy;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getTrafficLightId() { return trafficLightId; }
    public void setTrafficLightId(Long trafficLightId) { this.trafficLightId = trafficLightId; }

    public String getTrafficLightName() { return trafficLightName; }
    public void setTrafficLightName(String trafficLightName) { this.trafficLightName = trafficLightName; }

    public TrafficLightColor getFromState() { return fromState; }
    public void setFromState(TrafficLightColor fromState) { this.fromState = fromState; }

    public TrafficLightColor getToState() { return toState; }
    public void setToState(TrafficLightColor toState) { this.toState = toState; }

    public LocalDateTime getTransitionTime() { return transitionTime; }
    public void setTransitionTime(LocalDateTime transitionTime) { this.transitionTime = transitionTime; }

    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }

    public String getTriggeredBy() { return triggeredBy; }
    public void setTriggeredBy(String triggeredBy) { this.triggeredBy = triggeredBy; }
}
