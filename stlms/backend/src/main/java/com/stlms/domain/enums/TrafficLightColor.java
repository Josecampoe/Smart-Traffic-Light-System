package com.stlms.domain.enums;

/**
 * Represents the possible operational states of a traffic light.
 * Each value corresponds to a concrete State implementation in the pattern.
 */
public enum TrafficLightColor {
    RED,
    GREEN,
    YELLOW,
    FLASHING_YELLOW,
    EMERGENCY,
    OUT_OF_SERVICE
}
