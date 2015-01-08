package minium.pupino.config;

import minium.pupino.config.cucumber.CucumberConfiguration;
import minium.pupino.config.webdriver.WebElementsDriversConfiguration;

import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;

@Configuration
@Import({ ConfigConfiguration.class, CucumberConfiguration.class, WebElementsDriversConfiguration.class })
public class MiniumConfiguration {
}
