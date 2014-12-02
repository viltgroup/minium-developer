#set( $symbol_pound = '#' )
#set( $symbol_dollar = '$' )
#set( $symbol_escape = '\' )
package ${package};

import minium.pupino.config.PupinoConfiguration;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;
import org.springframework.context.annotation.Profile;
import org.springframework.context.support.PropertySourcesPlaceholderConfigurer;
import org.springframework.core.io.Resource;

import com.vilt.minium.script.test.WebElementsDriverConfig;

@Configuration
public class TestConfig {

    @Profile("!pupino")
    @Import(WebElementsDriverConfig.class)
    public static class DefaultWebElementsDriverConfig {
    }
    
    @Profile("pupino")
    @Import(PupinoConfiguration.class)
    public static class PupinoWebElementsDriverConfig {
    }
    
    @Value("classpath:config/${symbol_dollar}{minium.env:dev}.json")
    private Resource configFile;

    @Bean(name = "configFile")
    public Resource configFile() {
        return configFile;
    }
    
    @Bean
    public static PropertySourcesPlaceholderConfigurer placeHolderConfigurer() {
        return new PropertySourcesPlaceholderConfigurer();
    }

}