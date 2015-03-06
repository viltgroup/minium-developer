package minium.developer.project;

import java.io.File;

import minium.Elements;
import minium.cucumber.config.ConfigProperties;
import minium.script.js.JsBrowserFactory;
import minium.script.js.JsEngine;
import minium.script.js.MiniumJsEngineAdapter;
import minium.script.rhinojs.RhinoBrowserFactory;
import minium.script.rhinojs.RhinoEngine;
import minium.script.rhinojs.RhinoProperties;
import minium.script.rhinojs.RhinoProperties.RequireProperties;
import minium.web.CoreWebElements.DefaultWebElements;
import minium.web.actions.Browser;

import org.springframework.beans.factory.DisposableBean;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.bind.PropertiesConfigurationFactory;
import org.springframework.boot.env.YamlPropertySourceLoader;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.context.annotation.Lazy;
import org.springframework.context.support.PropertySourcesPlaceholderConfigurer;
import org.springframework.core.env.MutablePropertySources;
import org.springframework.core.env.PropertySource;
import org.springframework.core.env.PropertySources;
import org.springframework.core.io.FileSystemResource;

public class AbstractProjectContext implements InitializingBean, DisposableBean {

    protected final File projectDir;
    protected File resourcesDir;
    private JsEngine jsEngine;
    private ConfigProperties configProperties;
    private PropertySources propertySources;

    @Autowired
    private ConfigurableApplicationContext applicationContext;

    @Lazy
    @Autowired
    private Browser<DefaultWebElements> browser;

    public AbstractProjectContext(ProjectProperties projConfiguration) throws Exception {
        this.projectDir = projConfiguration.getDir();
        this.resourcesDir = projConfiguration.getResourcesDir();
    }

    @Override
    public void afterPropertiesSet() throws Exception {
        refreshConfiguration();
        this.jsEngine = createJsEngine();
    }

    protected void refreshConfiguration() throws Exception {
        this.propertySources = loadConfiguration();
        this.configProperties = getAppConfigBean("minium.config", ConfigProperties.class);
        if (jsEngine != null) {
            jsEngine.putJson("config", configProperties.toJson());
        }
    }

    public Elements root() {
        return browser.root();
    }

    public Object eval(Evaluation evaluation) throws Exception {
        refreshConfiguration();
        return jsEngine.eval(evaluation.getExpression(), evaluation.getLineNumber());
    }

    public StackTraceElement[] getExecutionStackTrace() {
        return jsEngine.getExecutionStackTrace();
    }

    public boolean isRunning() {
        return jsEngine == null ? false : jsEngine.isRunning();
    }

    public void cancel() {
        if (jsEngine != null) jsEngine.cancel();
    }

    @Override
    public void destroy() throws Exception {
        if (jsEngine != null) jsEngine.destroy();
    }

    public String toString(Object obj) {
        return jsEngine.toString(obj);
    }

    protected RhinoEngine createJsEngine() {
        RequireProperties require = new RequireProperties();
        require.getModulePaths().add(new File(resourcesDir, "modules").toURI().toString());
        RhinoProperties rhinoProperties = new RhinoProperties();
        rhinoProperties.setRequire(require);
        RhinoEngine rhinoEngine = new RhinoEngine(rhinoProperties);
        JsBrowserFactory browsers = new RhinoBrowserFactory(rhinoEngine);
        new MiniumJsEngineAdapter(browser, browsers).adapt(rhinoEngine);
        rhinoEngine.putJson("config", configProperties.toJson());
        return rhinoEngine;
    }

    protected PropertySources loadConfiguration() throws Exception {
        MutablePropertySources propertySources = new MutablePropertySources();
        File appConfigFile = new File(resourcesDir, "config/application.yml");
        if (appConfigFile.exists() && appConfigFile.isFile()) {
            YamlPropertySourceLoader loader = new YamlPropertySourceLoader();
            PropertySource<?> source = loader.load("application.yml", new FileSystemResource(appConfigFile), null);
            propertySources.addFirst(source);
        }
        return applyPlaceholderReplacements(propertySources);
    }

    protected <T> T getAppConfigBean(String targetName, Class<T> clazz) throws Exception {
        PropertiesConfigurationFactory<T> factory = new PropertiesConfigurationFactory<>(clazz);
        factory.setPropertySources(propertySources);
        factory.setTargetName(targetName);
        factory.afterPropertiesSet();
        return factory.getObject();
    }

    protected PropertySources applyPlaceholderReplacements(MutablePropertySources propertySources) {
        PropertySourcesPlaceholderConfigurer placeholderConfigurer = new PropertySourcesPlaceholderConfigurer();
        placeholderConfigurer.setPropertySources(propertySources);
        placeholderConfigurer.postProcessBeanFactory(applicationContext.getBeanFactory());
        PropertySources appliedPropertySources = placeholderConfigurer.getAppliedPropertySources();
        return appliedPropertySources;
    }

}
