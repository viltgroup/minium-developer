package minium.developer.web.rest;

import java.io.IOException;
import java.util.List;

import javax.servlet.http.HttpServletRequest;

import minium.cucumber.config.CucumberProperties.SnippetProperties;
import minium.developer.project.CucumberProjectContext;
import minium.developer.web.rest.dto.StepDefinitionDTO;
import net.masterthought.cucumber.json.Feature;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
@RequestMapping("/app/rest")
public class CucumberResource {

	@Autowired
	private CucumberProjectContext projectContext;

	@RequestMapping(value = "/launch", method = RequestMethod.POST,produces = "application/json")
	@ResponseBody
	public Feature launch(@RequestBody LaunchInfo launchInfo, HttpServletRequest request) throws IOException {
		Feature f = projectContext.launchCucumber(launchInfo, request.getSession().getId());
		return f;
	}

	@RequestMapping(value = "/snippets", method = RequestMethod.GET)
	@ResponseBody
	public List<SnippetProperties> getSnippets() throws IOException {
		return projectContext.getSnippets();
	}

	@RequestMapping(value = "/stepDefinitions", method = RequestMethod.GET)
	@ResponseBody
	public List<StepDefinitionDTO> getStepDefinitions() throws IOException {
		return projectContext.getStepDefinitions();
	}

	@RequestMapping(value = "/stop", method = RequestMethod.POST, produces = "text/plain; charset=utf-8")
	public ResponseEntity<String> stop() throws IOException, SecurityException, IllegalArgumentException, NoSuchFieldException, IllegalAccessException {
		projectContext.cancel();
		return new ResponseEntity<String>("OK", HttpStatus.OK);
	}

	@RequestMapping(value = "/isRunning", method = RequestMethod.GET, produces = "text/plain; charset=utf-8")
	@ResponseBody
	public String isRunning() throws IOException, SecurityException, IllegalArgumentException, NoSuchFieldException, IllegalAccessException {
		Boolean isRunning = projectContext.isRunning();
		return isRunning.toString();
	}

	@RequestMapping(value = "/sessionId", method = RequestMethod.GET, produces = "text/plain; charset=utf-8")
	@ResponseBody
	public String checkSessionId(HttpServletRequest request) {
		String sessionId = request.getSession().getId();
		return sessionId;
	}

}
