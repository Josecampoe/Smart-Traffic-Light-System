package com.stlms.exception;

/**
 * Thrown when an intersection with the requested ID does not exist in the database.
 */
public class IntersectionNotFoundException extends RuntimeException {

    public IntersectionNotFoundException(Long id) {
        super("Intersection not found with id: " + id);
    }
}
