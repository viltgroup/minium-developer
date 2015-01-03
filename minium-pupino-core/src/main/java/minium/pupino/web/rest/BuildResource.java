package minium.pupino.web.rest;

import java.io.IOException;
import java.net.URISyntaxException;
import java.util.List;

import javax.inject.Inject;
import javax.servlet.http.HttpServletResponse;

import minium.pupino.domain.Build;
import minium.pupino.domain.Project;
import minium.pupino.jenkins.ReporterParser;
import minium.pupino.repository.BuildRepository;
import minium.pupino.service.BuildService;
import minium.pupino.web.method.support.AntPath;
import minium.pupino.web.rest.dto.BuildDTO;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.codahale.metrics.annotation.Timed;

/**
 * REST controller for managing Build.
 */
@RestController
@RequestMapping("/app")
public class BuildResource {

    private final Logger log = LoggerFactory.getLogger(BuildResource.class);

    @Inject
    private BuildRepository buildRepository;
    
    @Autowired
    private ReporterParser reporter;
    
    @Autowired
	private BuildService buildService;
    
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
     * @throws URISyntaxException 
     * @throws IOException 
     */
    @RequestMapping(value = "/rest/builds",
            method = RequestMethod.GET,
            produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public List<BuildDTO> getAll() throws IOException, URISyntaxException {
        log.debug("REST request to get all Builds");
        return buildService.findAll();
    }

    /**
     * GET  /rest/builds/:id -> get the "id" build.
     * @throws IOException 
     */
    @RequestMapping(value = "/rest/builds/{id}",
            method = RequestMethod.GET,
            produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<BuildDTO> get(@PathVariable Long id, HttpServletResponse response) throws IOException {
        log.debug("REST request to get Build : {}", id);
        BuildDTO build = buildService.findOne(id);
        if (build == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(build, HttpStatus.OK);
    }
    
    
    /**
     * GET  /rest/builds/:id -> get the "id" build.
     * @throws IOException 
     * @throws URISyntaxException 
     */
    @RequestMapping(value = "/rest/builds/project",
            method = RequestMethod.POST,
            produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<List<BuildDTO>> getByProject(@RequestBody Project project, HttpServletResponse response) throws IOException, URISyntaxException {
        log.debug("REST request to get Build : {}", project);
        List<BuildDTO> builds = buildService.findByProject(project);
        if (builds.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(builds, HttpStatus.OK);
    }
    
    /**
     * GET  /rest/builds/lastBuild
     * @throws IOException 
     * @throws URISyntaxException 
     */
    @RequestMapping(value = "/rest/builds/lastBuild",
            method = RequestMethod.POST,
            produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<BuildDTO> getLastBuild(@RequestBody Project project, HttpServletResponse response) throws IOException, URISyntaxException {
        log.debug("REST request to get Build : {}", project);
        
        BuildDTO build = buildService.findLastBuild(project);
        
        if (build == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(build, HttpStatus.OK);
    }
    
    @RequestMapping(value = "/rest/builds/project/{buildId}/**", 
    				method = RequestMethod.GET,
    				produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
	public  ResponseEntity<BuildDTO> getBuild(@PathVariable("buildId") String buildId,@AntPath("featureURI") String featureURI) throws URISyntaxException, IOException {
    	 BuildDTO build = buildService.findByFeature(Integer.valueOf(buildId), featureURI);
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
