package minium.developer.web.rest;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
@RequestMapping("/app/rest/webDrivers")
public class WebDriverResource {

	@RequestMapping(value = "/is_launched", method = RequestMethod.GET, produces = "text/plain; charset=utf-8")
	@ResponseBody
	public ResponseEntity<String> isLaunched() {
		boolean webDriver = true;
		if (!webDriver) {
			return new ResponseEntity<String>("No Webdriver", HttpStatus.PRECONDITION_FAILED);
		} else {
			return new ResponseEntity<String>("Ok", HttpStatus.OK);
		}
	}

	@RequestMapping(value = "/{var}/create")
	@ResponseBody
	public void create(@PathVariable String var, @RequestParam("type") String type, @RequestParam(value = "remoteUrl", required = false) String remoteUrl) {
		//TODO
	}
}
