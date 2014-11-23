package minium.pupino.config;

import java.io.IOException;
import java.util.List;

import minium.pupino.webdriver.PupinoWebElementsDriverFactory;

import org.mozilla.javascript.Context;
import org.mozilla.javascript.tools.shell.Global;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.DisposableBean;
import org.springframework.beans.factory.annotation.Autowire;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.core.io.Resource;
import org.springframework.core.io.support.PathMatchingResourcePatternResolver;

import com.google.common.collect.Lists;
import com.vilt.minium.DefaultWebElementsDriver;
import com.vilt.minium.prefs.AppPreferences;
import com.vilt.minium.script.MiniumContextLoader;
import com.vilt.minium.script.MiniumScriptEngine;
import com.vilt.minium.script.WebElementsDriverFactory;

@Configuration
public class PupinoConfiguration implements DisposableBean {

    private static final Logger LOGGER = LoggerFactory.getLogger(PupinoConfiguration.class);

    private static DefaultWebElementsDriver wd;

    @Profile("pupino")
    @Bean(autowire = Autowire.NO)
    public DefaultWebElementsDriver wd() {
        return createIfNeeded();
    }

    @Bean
    public MiniumScriptEngine miniumScriptEngine() throws IOException {
        Context cx = Context.enter();
        Global scope = new Global(cx);
        scope.installRequire(cx, getModulesUrls(), false);
        WebElementsDriverFactory webElementsDriverFactory = WebElementsDriverFactory.instance();
        MiniumContextLoader contextLoader = new MiniumContextLoader(Thread.currentThread().getContextClassLoader(), webElementsDriverFactory);
        contextLoader.load(cx, scope);
        MiniumScriptEngine miniumScriptEngine = new MiniumScriptEngine(contextLoader, new AppPreferences());

        miniumScriptEngine.put("wd", wd());
        return miniumScriptEngine;
    }

    @Bean
    public PupinoWebElementsDriverFactory webElementsDriverFactory() {
        return new PupinoWebElementsDriverFactory();
    }

    @Override
    public synchronized void destroy() throws Exception {
        if (wd != null) {
            try {
                wd.close();
            } finally {
                wd = null;
            }
        }
    }

    protected synchronized DefaultWebElementsDriver createIfNeeded() {
        if (wd == null) {
            wd = webElementsDriverFactory().create();
        }
        return wd;
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
