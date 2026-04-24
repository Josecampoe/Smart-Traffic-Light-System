package com.stlms.repository;

import com.stlms.domain.model.TrafficLight;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface TrafficLightRepository extends JpaRepository<TrafficLight, Long> {
    List<TrafficLight> findByIntersectionId(Long intersectionId);
}
