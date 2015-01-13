package minium.pupino.web.rest;

import java.io.IOException;
import java.net.URISyntaxException;
import java.util.List;

import javax.inject.Inject;
import javax.servlet.http.HttpServletResponse;
import javax.xml.bind.JAXBException;

import minium.pupino.domain.Project;
import minium.pupino.repository.BuildRepository;
import minium.pupino.repository.ProjectRepository;
import minium.pupino.service.BuildService;
import minium.pupino.service.JenkinsService;
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
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.codahale.metrics.annotation.Timed;

/**
 * REST controller for managing Project.
 */
@RestController
@RequestMapping("/app")
public class ProjectResource {

	private final Logger log = LoggerFactory.getLogger(ProjectResource.class);

	private int i = 0;

	@Inject
	private ProjectRepository projectRepository;
	
	@Inject
	private BuildService buildService;
	
	@Inject
	private BuildRepository buildRepository;
	
	@Autowired
	private JenkinsService jenkinService;
	
	/**
	 * POST /rest/projects -> Create a new project.
	 * 
	 * @throws URISyntaxException
	 * @throws IOException
	 * @throws JAXBException 
	 */
	@RequestMapping(value = "/rest/projects", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
	@Timed
	public @ResponseBody ResponseEntity<String> create(@RequestBody Project project) throws URISyntaxException, JAXBException {
		log.debug("REST request to save Project : {}", project);
		HttpStatus httpStatus = null;
		try {
			projectRepository.save(project);
			jenkinService.createJob(project.getName(),project.getRepository_type(),project.getRepository_url());
			httpStatus = HttpStatus.CREATED;
		} catch (IOException e) {
			httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
			e.printStackTrace();
		}
		return new ResponseEntity<String>("Created", httpStatus);
	}
	
	/**
	 * GET /rest/projects -> get all the projects.
	 * @throws URISyntaxException 
	 * @throws IOException 
	 */
	@RequestMapping(value = "/rest/projects", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
	@Timed
	public List<Project> getAll() throws IOException, URISyntaxException {
		log.debug("REST request to get all Projects");
		if (i == 0) {
			Project p = projectRepository.findOne((long) 105);
			
			List<BuildDTO> builds = jenkinService.getBuilds(p.getName());
			buildService.save(builds, p);
//			
//			
//			p = projectRepository.findOne((long) 3);
//			builds = jenkinService.getBuilds("my-cp-test");
//			buildService.save(builds, p);
			
//			Build buildMPay = buildRepository.findOne((long) 3);
//			buildMPay.setArtifact(Utils.artifactFromFile("mocks/mock-cgd-store.json"));
//			buildRepository.save(buildMPay);
			
			 i = 1;
		}
		List<Project> p = projectRepository.findAll();
		return p;
	}

	/**
	 * GET /rest/projects/:id -> get the "id" project.
	 */
	@RequestMapping(value = "/rest/projects/{id}", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
	@Timed
	public ResponseEntity<Project> get(@PathVariable Long id, HttpServletResponse response) {
		log.debug("REST request to get Project : {}", id);
		Project project = projectRepository.findOne(id);
		if (project == null) {
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		}
		return new ResponseEntity<>(project, HttpStatus.OK);
	}

	/**
	 * DELETE /rest/projects/:id -> delete the "id" project.
	 */
	@RequestMapping(value = "/rest/projects/{id}", method = RequestMethod.DELETE, produces = MediaType.APPLICATION_JSON_VALUE)
	@Timed
	public void delete(@PathVariable Long id) {
		log.debug("REST request to delete Project : {}", id);
		projectRepository.delete(id);
	}
}
