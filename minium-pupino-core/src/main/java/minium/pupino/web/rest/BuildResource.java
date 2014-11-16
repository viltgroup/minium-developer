package minium.pupino.web.rest;

import com.codahale.metrics.annotation.Timed;
import minium.pupino.domain.Build;
import minium.pupino.repository.BuildRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.inject.Inject;
import javax.servlet.http.HttpServletResponse;
import java.util.List;

/**
 * REST controller for managing Build.
 */
@RestController
@RequestMapping("/app")
public class BuildResource {

    private final Logger log = LoggerFactory.getLogger(BuildResource.class);

    @Inject
    private BuildRepository buildRepository;

    /**
     * POST  /rest/builds -> Create a new build.
     */
    @RequestMapping(value = "/rest/builds",
            method = RequestMethod.POST,
            produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public void create(@RequestBody Build build) {
        log.debug("REST request to save Build : {}", build);
        buildRepository.save(build);
    }

    /**
     * GET  /rest/builds -> get all the builds.
     */
    @RequestMapping(value = "/rest/builds",
            method = RequestMethod.GET,
            produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public List<Build> getAll() {
        log.debug("REST request to get all Builds");
        return buildRepository.findAll();
    }

    /**
     * GET  /rest/builds/:id -> get the "id" build.
     */
    @RequestMapping(value = "/rest/builds/{id}",
            method = RequestMethod.GET,
            produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<Build> get(@PathVariable Long id, HttpServletResponse response) {
        log.debug("REST request to get Build : {}", id);
        Build build = buildRepository.findOne(id);
        if (build == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(build, HttpStatus.OK);
    }

    /**
     * DELETE  /rest/builds/:id -> delete the "id" build.
     */
    @RequestMapping(value = "/rest/builds/{id}",
            method = RequestMethod.DELETE,
            produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public void delete(@PathVariable Long id) {
        log.debug("REST request to delete Build : {}", id);
        buildRepository.delete(id);
    }
}
