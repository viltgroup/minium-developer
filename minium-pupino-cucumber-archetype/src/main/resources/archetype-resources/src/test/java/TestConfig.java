#set( $symbol_pound = '#' )
#set( $symbol_dollar = '$' )
#set( $symbol_escape = '\' )
package ${package};

import minium.pupino.config.cucumber.CucumberConfiguration;
import minium.pupino.config.webdriver.WebElementsDriversConfiguration;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;
import org.springframework.core.io.Resource;

@Configuration
@Import({ CucumberConfiguration.class, WebElementsDriversConfiguration.class })
public class TestConfig {

    @Value("file:src/test/resources/config/${symbol_dollar}{minium.env:dev}.json")
    private Resource configFile;

    @Bean(name = "configFile")
    public Resource configFile() {
        return configFile;
    }
}