package minium.pupino.config;

import java.io.IOException;
import java.util.List;

import minium.script.rhinojs.RhinoEngine;
import minium.script.rhinojs.RhinoProperties;
import minium.script.rhinojs.RhinoProperties.RequireProperties;

import org.openqa.selenium.WebDriver;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.Resource;
import org.springframework.core.io.support.PathMatchingResourcePatternResolver;

import com.google.common.collect.Lists;

@Configuration
@EnableConfigurationProperties
public class PupinoConfiguration {

    public static final String PUPINO_PROFILE = "pupino";

    private static final Logger LOGGER = LoggerFactory.getLogger(PupinoConfiguration.class);

    @Bean
    @ConfigurationProperties(prefix = "minium.rhino")
    public RhinoProperties rhinoProperties() {
        RequireProperties require = new RequireProperties();
        RhinoProperties rhinoProperties = new RhinoProperties();
        rhinoProperties.setRequire(require);
        return rhinoProperties;
    }

    @Autowired
    @Bean
    public RhinoEngine rhinoEngine(WebDriver wd) throws IOException {
        RhinoEngine rhinoEngine = new RhinoEngine(rhinoProperties());
        rhinoEngine.put("wd", wd);
        return rhinoEngine;
    }

    protected List<String> getModulesUrls() throws IOException {
        PathMatchingResourcePatternResolver resolver = new PathMatchingResourcePatternResolver(Thread.currentThread().getContextClassLoader());
        Resource[] resources = resolver.getResources("classpath*:modules");
        List<String> moduleUrls = Lists.newArrayList();
        LOGGER.debug("Modules:");
        for (Resource resource : resources) {
            String module = resource.getURL().toExternalForm();
            moduleUrls.add(module);
            LOGGER.debug("\t{}", module);
        }
        return moduleUrls;
    }
}
