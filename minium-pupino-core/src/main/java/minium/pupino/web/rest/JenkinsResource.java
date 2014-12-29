package minium.pupino.web.rest;

import java.io.IOException;
import java.net.URISyntaxException;
import java.util.List;
import java.util.concurrent.ExecutionException;

import minium.pupino.domain.Build;
import minium.pupino.domain.Project;
import minium.pupino.repository.ProjectRepository;
import minium.pupino.service.BuildService;
import minium.pupino.service.FormatService;
import minium.pupino.service.JenkinsService;
import minium.pupino.web.method.support.AntPath;
import minium.pupino.web.rest.dto.BrowsersDTO;
import minium.pupino.web.rest.dto.BuildDTO;
import minium.pupino.worker.JenkinsWorker;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
@RequestMapping("/app/rest")
public class JenkinsResource {

	private static final Logger LOGGER = LoggerFactory.getLogger(FormatService.class);

	@Autowired
	private JenkinsService jenkinService;
	
	@Autowired
	private JenkinsWorker jenkinsWorker;
	
	@Autowired
	private BuildService buildService;
	
	@Autowired
	private ProjectRepository projectService;
	/**
	 * GET /builds -> get all the build in jenkins.
	 * 
	 * @throws URISyntaxException
	 * @throws IOException
	 */
	@RequestMapping(value = "/jenkins/builds/{jobName}", method = RequestMethod.GET)
	public @ResponseBody List<BuildDTO> getAllBuilds(@PathVariable("jobName") String jobName) throws URISyntaxException, IOException {
		LOGGER.debug("REST request to get all builds for {}", jobName);
		return jenkinService.getBuilds(jobName);
	}
	
	@RequestMapping(value = "/jenkins/builds/{jobName}/{buildID}/as", method = RequestMethod.GET)
	public @ResponseBody BuildDTO getBuild(@PathVariable("jobName") String jobName,@PathVariable("buildID") String buildID) throws URISyntaxException, IOException {
		LOGGER.debug("REST request to get all builds for {}", jobName);
		return jenkinService.getBuildById(jobName,buildID);
	}

	@RequestMapping(value = "/jenkins/builds/create/{projectId}", method = RequestMethod.POST)
	public @ResponseBody ResponseEntity<String> createBuild(@PathVariable("projectId") String projectId,@RequestBody BrowsersDTO buildConfig) throws URISyntaxException, NumberFormatException, InterruptedException, ExecutionException {
		LOGGER.debug("Create a Build for Job {} with configuration {}",projectId, buildConfig);
		HttpStatus httpStatus = null;
		try {
			//get the project
			Project project = projectService.findOne(Long.valueOf(projectId));
			//create the build in jenkins
			jenkinService.createBuild(project,buildConfig);
			//create the build in database
			Build build = buildService.create(project);
			//start worker
			jenkinsWorker.checkBuildState(build);
			httpStatus = HttpStatus.CREATED;
		} catch (IOException e) {
			httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
			e.printStackTrace();
			
		}
		
		return new ResponseEntity<String>("Created", httpStatus);
	}
	
	@RequestMapping(value = "/jenkins/builds/{jobName}/{buildId}/**", method = RequestMethod.GET)
	public @ResponseBody BuildDTO getBuild(@PathVariable("jobName") String jobName,@PathVariable("buildId") String buildId,@AntPath("featureURI") String featureURI) throws URISyntaxException, IOException {
		LOGGER.debug("Listing a Build and feature for Job {} and feature {}", jobName, featureURI);
		return jenkinService.getBuild(jobName, buildId, featureURI);
	}

}
