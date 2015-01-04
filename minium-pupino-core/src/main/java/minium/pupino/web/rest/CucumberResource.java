package minium.pupino.web.rest;

import java.io.IOException;
import java.net.URI;
import java.util.List;

import javax.servlet.http.HttpServletRequest;

import minium.pupino.domain.LaunchInfo;
import minium.pupino.service.LaunchService;
import minium.pupino.web.method.support.BaseURL;
import net.masterthought.cucumber.json.Feature;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
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
	private LaunchService launchService;

    @RequestMapping(value = "/launch", method = RequestMethod.POST)
    @ResponseBody
    public Feature launch(@BaseURL URI baseUri, @RequestBody LaunchInfo launchInfo,HttpServletRequest request) throws IOException {
        return launchService.launch(baseUri, launchInfo,request.getSession().getId());
    }

    @RequestMapping(value = "/stepDefinitions", method = RequestMethod.GET)
    @ResponseBody
    public List<StepDefinitionDTO> getStepDefinitions() throws IOException {
        return launchService.getStepDefinitions();
    }

    @RequestMapping(value = "/stop", method = RequestMethod.POST)
    public ResponseEntity<String>  stop() throws IOException, SecurityException, IllegalArgumentException, NoSuchFieldException, IllegalAccessException {
        launchService.stopLaunch();
        return new ResponseEntity<String>("OK", HttpStatus.OK);
    }

}
