package minium.pupino.web.rest;

import java.io.IOException;
import java.net.URISyntaxException;
import java.util.List;

import minium.pupino.service.FormatService;
import minium.pupino.service.JenkinsService;
import minium.pupino.web.rest.dto.BuildDTO;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
@RequestMapping("/app/rest")
public class JenkinsResource {

	private static final Logger LOGGER = LoggerFactory.getLogger(FormatService.class);

	@Autowired
	private JenkinsService jenkinService;

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

	@RequestMapping(value = "/jenkins/builds/create/{jobName}", method = RequestMethod.POST)
	public @ResponseBody ResponseEntity<String> createBuild(@PathVariable("jobName") String jobName) throws URISyntaxException, IOException {
		LOGGER.debug("Create a Build for Job {}", jobName);
		jenkinService.createBuild(jobName);
		return new ResponseEntity<String>("Created", HttpStatus.OK);
	}

}
