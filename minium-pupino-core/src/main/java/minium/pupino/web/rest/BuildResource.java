package minium.pupino.web.rest;

import java.io.File;
import java.io.IOException;
import java.util.List;

import javax.inject.Inject;
import javax.servlet.http.HttpServletResponse;

import minium.pupino.domain.Build;
import minium.pupino.jenkins.ReporterParser;
import minium.pupino.repository.BuildRepository;
import minium.pupino.web.rest.dto.BuildDTO;
import net.masterthought.cucumber.json.Feature;

import org.apache.commons.io.FileUtils;
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
     * @throws IOException 
     */
    @RequestMapping(value = "/rest/builds/{id}",
            method = RequestMethod.GET,
            produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<BuildDTO> get(@PathVariable Long id, HttpServletResponse response) throws IOException {
        log.debug("REST request to get Build : {}", id);
        Build build = buildRepository.findOne(id);
        File file = new File("mocks/artifact.json");
        build.setArtifact(FileUtils.readFileToString(file));
        buildRepository.save(build);
       
        List<Feature> features = reporter.parseJsonResult(build.getArtifact());
        BuildDTO buildDTO;
    	buildDTO = new BuildDTO(1, "", null, false, "", 0,"", "as", 0, "", "", features, null);
    	for (Feature f : features) {
			f.processSteps();
		}
        if (build == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(buildDTO, HttpStatus.OK);
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
