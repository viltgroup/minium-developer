package minium.pupino.config;

import minium.script.rhinojs.RhinoProperties;
import minium.script.rhinojs.RhinoProperties.RequireProperties;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@EnableConfigurationProperties
public class PupinoConfiguration {

    public static final String PUPINO_PROFILE = "pupino";

    @Bean
    @ConfigurationProperties(prefix = "minium.rhino")
    public RhinoProperties rhinoProperties() {
        RequireProperties require = new RequireProperties();
        RhinoProperties rhinoProperties = new RhinoProperties();
        rhinoProperties.setRequire(require);
        return rhinoProperties;
    }

}
