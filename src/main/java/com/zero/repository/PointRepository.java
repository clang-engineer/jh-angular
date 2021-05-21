package com.zero.repository;

import com.zero.domain.Point;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Point entity.
 */
@SuppressWarnings("unused")
@Repository
public interface PointRepository extends JpaRepository<Point, Long> {}
