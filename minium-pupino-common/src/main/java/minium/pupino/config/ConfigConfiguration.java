package minium.pupino.config;

import minium.pupino.cucumber.JsVariable;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@EnableConfigurationProperties(ConfigProperties.class)
public class ConfigConfiguration {

    @Bean
    @ConfigurationProperties("minium.config")
    @JsVariable("config")
    public ConfigProperties config() {
        return new ConfigProperties();
    }
}
