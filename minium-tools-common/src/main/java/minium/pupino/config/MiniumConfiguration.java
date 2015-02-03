package minium.pupino.config;

import minium.pupino.config.cucumber.CucumberConfiguration;
import minium.pupino.config.visual.VisualConfiguration;
import minium.pupino.config.webdriver.WebElementsDriversConfiguration;
import minium.pupino.cucumber.JsVariablePostProcessor;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;

@Configuration
@Import({ ConfigConfiguration.class, CucumberConfiguration.class, WebElementsDriversConfiguration.class, VisualConfiguration.class })
public class MiniumConfiguration {

    @Bean
    public JsVariablePostProcessor jsVariablePostProcessor() {
        return new JsVariablePostProcessor();
    }

}
