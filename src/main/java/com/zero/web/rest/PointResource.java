package com.zero.web.rest;

import static org.elasticsearch.index.query.QueryBuilders.*;

import com.zero.domain.Point;
import com.zero.repository.PointRepository;
import com.zero.repository.search.PointSearchRepository;
import com.zero.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.PaginationUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.zero.domain.Point}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class PointResource {

    private final Logger log = LoggerFactory.getLogger(PointResource.class);

    private static final String ENTITY_NAME = "point";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final PointRepository pointRepository;

    private final PointSearchRepository pointSearchRepository;

    public PointResource(PointRepository pointRepository, PointSearchRepository pointSearchRepository) {
        this.pointRepository = pointRepository;
        this.pointSearchRepository = pointSearchRepository;
    }

    /**
     * {@code POST  /points} : Create a new point.
     *
     * @param point the point to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new point, or with status {@code 400 (Bad Request)} if the point has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/points")
    public ResponseEntity<Point> createPoint(@Valid @RequestBody Point point) throws URISyntaxException {
        log.debug("REST request to save Point : {}", point);
        if (point.getId() != null) {
            throw new BadRequestAlertException("A new point cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Point result = pointRepository.save(point);
        pointSearchRepository.save(result);
        return ResponseEntity
            .created(new URI("/api/points/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /points/:id} : Updates an existing point.
     *
     * @param id the id of the point to save.
     * @param point the point to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated point,
     * or with status {@code 400 (Bad Request)} if the point is not valid,
     * or with status {@code 500 (Internal Server Error)} if the point couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/points/{id}")
    public ResponseEntity<Point> updatePoint(@PathVariable(value = "id", required = false) final Long id, @Valid @RequestBody Point point)
        throws URISyntaxException {
        log.debug("REST request to update Point : {}, {}", id, point);
        if (point.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, point.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!pointRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Point result = pointRepository.save(point);
        pointSearchRepository.save(result);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, point.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /points/:id} : Partial updates given fields of an existing point, field will ignore if it is null
     *
     * @param id the id of the point to save.
     * @param point the point to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated point,
     * or with status {@code 400 (Bad Request)} if the point is not valid,
     * or with status {@code 404 (Not Found)} if the point is not found,
     * or with status {@code 500 (Internal Server Error)} if the point couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/points/{id}", consumes = "application/merge-patch+json")
    public ResponseEntity<Point> partialUpdatePoint(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Point point
    ) throws URISyntaxException {
        log.debug("REST request to partial update Point partially : {}, {}", id, point);
        if (point.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, point.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!pointRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Point> result = pointRepository
            .findById(point.getId())
            .map(
                existingPoint -> {
                    if (point.getTitle() != null) {
                        existingPoint.setTitle(point.getTitle());
                    }
                    if (point.getDescription() != null) {
                        existingPoint.setDescription(point.getDescription());
                    }

                    return existingPoint;
                }
            )
            .map(pointRepository::save)
            .map(
                savedPoint -> {
                    pointSearchRepository.save(savedPoint);

                    return savedPoint;
                }
            );

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, point.getId().toString())
        );
    }

    /**
     * {@code GET  /points} : get all the points.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of points in body.
     */
    @GetMapping("/points")
    public ResponseEntity<List<Point>> getAllPoints(Pageable pageable) {
        log.debug("REST request to get a page of Points");
        Page<Point> page = pointRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /points/:id} : get the "id" point.
     *
     * @param id the id of the point to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the point, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/points/{id}")
    public ResponseEntity<Point> getPoint(@PathVariable Long id) {
        log.debug("REST request to get Point : {}", id);
        Optional<Point> point = pointRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(point);
    }

    /**
     * {@code DELETE  /points/:id} : delete the "id" point.
     *
     * @param id the id of the point to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/points/{id}")
    public ResponseEntity<Void> deletePoint(@PathVariable Long id) {
        log.debug("REST request to delete Point : {}", id);
        pointRepository.deleteById(id);
        pointSearchRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }

    /**
     * {@code SEARCH  /_search/points?query=:query} : search for the point corresponding
     * to the query.
     *
     * @param query the query of the point search.
     * @param pageable the pagination information.
     * @return the result of the search.
     */
    @GetMapping("/_search/points")
    public ResponseEntity<List<Point>> searchPoints(@RequestParam String query, Pageable pageable) {
        log.debug("REST request to search for a page of Points for query {}", query);
        Page<Point> page = pointSearchRepository.search(queryStringQuery(query), pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }
}
