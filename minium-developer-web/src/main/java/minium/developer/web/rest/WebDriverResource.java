package minium.developer.web.rest;

import java.io.IOException;
import java.util.List;

import org.openqa.selenium.WebDriver;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import minium.developer.config.WebDriversProperties.DeveloperWebDriverProperties;
import minium.developer.service.WebDriverService;
import minium.web.DelegatorWebDriver;

@Controller
@RequestMapping("/app/rest/webdrivers")
public class WebDriverResource {

    @Autowired
    protected DelegatorWebDriver delegatorWebDriver;

    @Autowired
    protected WebDriverService webDriverService;

    @RequestMapping(value = "/isLaunched", method = RequestMethod.GET, produces = "text/plain; charset=utf-8")
    @ResponseBody
    public ResponseEntity<String> isLaunched() {
        boolean webDriver = delegatorWebDriver.isValid();
        if (!webDriver) {
            return new ResponseEntity<String>("No Webdriver", HttpStatus.PRECONDITION_FAILED);
        } else {
            return new ResponseEntity<String>("Ok", HttpStatus.OK);
        }
    }

    @RequestMapping(value = "/isRecorderAvailableForBrowser", method = RequestMethod.GET)
    @ResponseBody
    public boolean isRecorderAvailableForBrowser(@RequestParam(value = "browser") String browser) {
        return webDriverService.isRecorderAvailableForBrowser(browser);
    }

    @RequestMapping(value = "/create", method = RequestMethod.POST)
    @ResponseBody
    public void create(@RequestBody DeveloperWebDriverProperties webDriverProperties) throws IOException {
        String browserName = (String) webDriverProperties.getDesiredCapabilities().get("browserName");
        if (webDriverProperties.getUrl() == null) {
            webDriverService.webDriverExists(browserName);
        }
        WebDriver webDriver = webDriverService.createWebDriver(webDriverProperties);
        delegatorWebDriver.setDelegate(webDriver);
    }

    @RequestMapping(value = "/download/all", method = RequestMethod.GET, produces = "text/plain; charset=utf-8")
    @ResponseBody
    public ResponseEntity<String> downloadAll() throws IOException {
        webDriverService.downloadAllWebDrivers();
        return new ResponseEntity<String>("Ok", HttpStatus.OK);
    }

    @RequestMapping(value = "/update/all", method = RequestMethod.GET, produces = "text/plain; charset=utf-8")
    @ResponseBody
    public ResponseEntity<String> updateAll() throws IOException {
        webDriverService.updateAllWebDrivers();
        return new ResponseEntity<String>("Ok", HttpStatus.OK);
    }

    @RequestMapping(value = "/getAvailableWebdrivers", method = RequestMethod.GET)
    @ResponseBody
    public List<DeveloperWebDriverProperties> getAvailableWebdrivers() {
        return webDriverService.getAvailableWebdrivers();
    }
}
