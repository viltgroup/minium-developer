package minium.developer.service;

import static org.junit.Assert.assertThat;

import java.util.List;

import javax.inject.Inject;

import org.hamcrest.Matchers;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.TestExecutionListeners;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.support.DependencyInjectionTestExecutionListener;
import org.springframework.test.context.web.WebAppConfiguration;

import minium.developer.Application;
import minium.developer.config.WebDriversProperties.DeveloperWebDriverProperties;

@RunWith(SpringJUnit4ClassRunner.class)
@SpringBootTest(classes = Application.class)
@WebAppConfiguration
@ActiveProfiles("test")
@TestExecutionListeners(listeners = { DependencyInjectionTestExecutionListener.class })
public class WebDriverServiceTest {

    @Inject
    private WebDriverService webDriverService;

    @Test
    public void testNumberOfWebDriversAvailable() {
        List<DeveloperWebDriverProperties> availableWebdrivers = webDriverService.getAvailableWebdrivers();
        assertThat(availableWebdrivers, Matchers.hasSize(2));
    }
}
