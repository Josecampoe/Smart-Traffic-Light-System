package com.stlms.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import java.net.URI;
import java.time.Instant;

/**
 * Global exception handler that returns RFC 7807 Problem Details responses
 * for all known application exceptions.
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(TrafficLightNotFoundException.class)
    public ProblemDetail handleTrafficLightNotFound(TrafficLightNotFoundException ex) {
        ProblemDetail problem = ProblemDetail.forStatusAndDetail(HttpStatus.NOT_FOUND, ex.getMessage());
        problem.setTitle("Traffic Light Not Found");
        problem.setType(URI.create("/errors/traffic-light-not-found"));
        problem.setProperty("timestamp", Instant.now());
        return problem;
    }

    @ExceptionHandler(IntersectionNotFoundException.class)
    public ProblemDetail handleIntersectionNotFound(IntersectionNotFoundException ex) {
        ProblemDetail problem = ProblemDetail.forStatusAndDetail(HttpStatus.NOT_FOUND, ex.getMessage());
        problem.setTitle("Intersection Not Found");
        problem.setType(URI.create("/errors/intersection-not-found"));
        problem.setProperty("timestamp", Instant.now());
        return problem;
    }

    @ExceptionHandler(InvalidStateTransitionException.class)
    public ProblemDetail handleInvalidTransition(InvalidStateTransitionException ex) {
        ProblemDetail problem = ProblemDetail.forStatusAndDetail(HttpStatus.CONFLICT, ex.getMessage());
        problem.setTitle("Invalid State Transition");
        problem.setType(URI.create("/errors/invalid-state-transition"));
        problem.setProperty("timestamp", Instant.now());
        problem.setProperty("fromState", ex.getFromState());
        problem.setProperty("toState", ex.getToState());
        problem.setProperty("trafficLightId", ex.getTrafficLightId());
        return problem;
    }

    @ExceptionHandler(Exception.class)
    public ProblemDetail handleGenericException(Exception ex) {
        ProblemDetail problem = ProblemDetail.forStatusAndDetail(
                HttpStatus.INTERNAL_SERVER_ERROR, "An unexpected error occurred");
        problem.setTitle("Internal Server Error");
        problem.setType(URI.create("/errors/internal-server-error"));
        problem.setProperty("timestamp", Instant.now());
        problem.setProperty("message", ex.getMessage());
        return problem;
    }
}
