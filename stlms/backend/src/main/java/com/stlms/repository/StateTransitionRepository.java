package com.stlms.repository;

import com.stlms.domain.enums.TrafficLightColor;
import com.stlms.domain.model.StateTransition;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Map;

@Repository
public interface StateTransitionRepository extends JpaRepository<StateTransition, Long> {

    List<StateTransition> findByTrafficLightIdOrderByTransitionTimeDesc(Long trafficLightId);

    Page<StateTransition> findAllByOrderByTransitionTimeDesc(Pageable pageable);

    @Query("SELECT s.toState, COUNT(s) FROM StateTransition s GROUP BY s.toState")
    List<Object[]> countTransitionsGroupedByTargetState();
}
