package minium.developer.service;

import static org.junit.Assert.assertThat;

import java.util.List;

import javax.inject.Inject;

import minium.developer.Application;
import minium.developer.config.WebDriversProperties.DeveloperWebDriverProperties;

import org.hamcrest.Matchers;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.boot.test.IntegrationTest;
import org.springframework.boot.test.SpringApplicationConfiguration;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.web.WebAppConfiguration;

@RunWith(SpringJUnit4ClassRunner.class)
@SpringApplicationConfiguration(classes = Application.class)
@WebAppConfiguration
@IntegrationTest
@ActiveProfiles("test")
public class WebDriverServiceTest {

    @Inject
    private WebDriverService webDriverService;

    @Test
    public void testNumberOfWebDriversAvailable() {
        List<DeveloperWebDriverProperties> availableWebdrivers = webDriverService.getAvailableWebdrivers();
        assertThat(availableWebdrivers, Matchers.hasSize(3));
    }
}
