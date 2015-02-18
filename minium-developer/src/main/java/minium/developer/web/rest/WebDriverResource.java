package minium.developer.web.rest;

import minium.web.DelegatorWebDriver;
import minium.web.config.WebDriverFactory;
import minium.web.config.WebDriverProperties;

import org.openqa.selenium.WebDriver;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
@RequestMapping("/app/rest/webdrivers")
public class WebDriverResource {

    @Autowired
    protected WebDriverFactory webDriverFactory;

    @Autowired
    protected DelegatorWebDriver delegatorWebDriver;

	@RequestMapping(value = "/isLaunched", method = RequestMethod.GET, produces = "text/plain; charset=utf-8")
	@ResponseBody
	public boolean isLaunched() {
	    return delegatorWebDriver.getDelegate() != null;
	}

	@RequestMapping(value = "/create", method = RequestMethod.POST)
	@ResponseBody
	public void create(@RequestBody WebDriverProperties webDriverProperties) {
	    WebDriver webDriver = webDriverFactory.create(webDriverProperties);
	    delegatorWebDriver.setDelegate(webDriver);
	}
}
