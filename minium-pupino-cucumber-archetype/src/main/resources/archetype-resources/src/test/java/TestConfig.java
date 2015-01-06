#set( $symbol_pound = '#' )
#set( $symbol_dollar = '$' )
#set( $symbol_escape = '\' )
package ${package};

import minium.pupino.config.cucumber.CucumberConfiguration;
import minium.pupino.config.webdriver.WebElementsDriversConfiguration;
import minium.pupino.cucumber.ConfigProperties;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;

@Configuration
@Import({ CucumberConfiguration.class, WebElementsDriversConfiguration.class })
public class TestConfig {

    @Bean
    @ConfigurationProperties(prefix = "config")
    public ConfigProperties config() {
        return new ConfigProperties();
    }
}