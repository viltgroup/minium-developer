package minium.pupino.config;

import java.io.IOException;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Lazy;
import org.springframework.core.io.Resource;
import org.springframework.core.io.support.PathMatchingResourcePatternResolver;

import com.google.common.collect.Lists;
import com.vilt.minium.DefaultWebElementsDriver;
import com.vilt.minium.script.MiniumScriptEngine;
import com.vilt.minium.script.RhinoPreferences;

@Configuration
public class PupinoConfiguration {

    public static final String PUPINO_PROFILE = "pupino";

    private static final Logger LOGGER = LoggerFactory.getLogger(PupinoConfiguration.class);

    @Autowired
    @Lazy
    private DefaultWebElementsDriver wd;

    @Bean
    public MiniumScriptEngine miniumScriptEngine() throws IOException {
        RhinoPreferences preferences = new RhinoPreferences();
        preferences.setModulePath(getModulesUrls());
        MiniumScriptEngine miniumScriptEngine = new MiniumScriptEngine(preferences);
        miniumScriptEngine.put("wd", wd);
        return miniumScriptEngine;
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
