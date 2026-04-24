package com.stlms.exception;

/**
 * Thrown when a traffic light with the requested ID does not exist in the database.
 */
public class TrafficLightNotFoundException extends RuntimeException {

    public TrafficLightNotFoundException(Long id) {
        super("Traffic light not found with id: " + id);
    }
}
