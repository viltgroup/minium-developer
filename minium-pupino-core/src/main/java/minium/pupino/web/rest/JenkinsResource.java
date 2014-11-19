package minium.pupino.web.rest;

import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.Map;

import minium.pupino.service.FormatService;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import com.offbytwo.jenkins.JenkinsServer;
import com.offbytwo.jenkins.model.Job;

@Controller
@RequestMapping("/app/rest")
public class JenkinsResource {
	
	private static final Logger LOGGER = LoggerFactory.getLogger(FormatService.class);
	/**
	 * GET /jobs -> get all the jobs in jenkins.
	 * @throws URISyntaxException 
	 * @throws IOException 
	 */
	@RequestMapping(value = "/rest/projects", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
	public Map<String, Job> getAll() throws URISyntaxException, IOException {
		LOGGER.debug("REST request to get all Jobs");
		JenkinsServer jenkins = new JenkinsServer(new URI("http://localhost:8080/jenkins"));
		return jenkins.getJobs();
	}

}
