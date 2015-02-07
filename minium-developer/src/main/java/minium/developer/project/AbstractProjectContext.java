package minium.developer.project;

import static minium.script.rhinojs.RhinoWebModules.rhinoModule;
import static minium.web.WebModules.baseModule;
import static minium.web.WebModules.combine;
import static minium.web.WebModules.conditionalModule;
import static minium.web.WebModules.debugModule;
import static minium.web.WebModules.interactableModule;
import static minium.web.WebModules.positionModule;

import java.io.File;

import minium.cucumber.config.ConfigProperties;
import minium.script.js.JsEngine;
import minium.script.rhinojs.JsFunctionWebElements;
import minium.script.rhinojs.RhinoEngine;
import minium.script.rhinojs.RhinoProperties;
import minium.script.rhinojs.RhinoProperties.RequireProperties;
import minium.web.CoreWebElements.DefaultWebElements;
import minium.web.WebElementsFactory;
import minium.web.WebElementsFactory.Builder;
import minium.web.WebFinder;
import minium.web.WebModule;
import minium.web.config.WebDriverFactory;
import minium.web.config.WebDriverProperties;
import minium.web.internal.actions.WebDebugInteractionPerformer;

import org.openqa.selenium.WebDriver;
import org.springframework.beans.factory.DisposableBean;
import org.springframework.boot.bind.PropertiesConfigurationFactory;
import org.springframework.boot.env.YamlPropertySourceLoader;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.context.support.PropertySourcesPlaceholderConfigurer;
import org.springframework.core.env.MutablePropertySources;
import org.springframework.core.env.PropertySource;
import org.springframework.core.env.PropertySources;
import org.springframework.core.io.FileSystemResource;

import com.google.common.base.Preconditions;

public class AbstractProjectContext implements DisposableBean {

    protected final File projectDir;
    protected final File resourcesDir;
    protected final ConfigurableApplicationContext applicationContext;
    private JsEngine jsEngine;
    private WebDriverProperties webDriverProperties;
    private ConfigProperties configProperties;
    private PropertySources propertySources;
    private WebDriver webDriver;
    private WebFinder<DefaultWebElements> by;

    public AbstractProjectContext(File projectDir, ConfigurableApplicationContext applicationContext) throws Exception {
        this.projectDir = projectDir;
        this.applicationContext = applicationContext;
        this.resourcesDir = new File(projectDir, "src/test/resources");
        this.propertySources = loadConfiguration();
        this.webDriverProperties = getAppConfigBean("minium.webdriver", WebDriverProperties.class);
        this.configProperties = getAppConfigBean("minium.config", ConfigProperties.class);
        this.webDriver = new WebDriverFactory().create(webDriverProperties);
        this.by = new WebFinder<>(createElementsFactory().createRoot(), DefaultWebElements.class, JsFunctionWebElements.class);
        this.jsEngine = createJsEngine();
    }

    public JsEngine getJsEngine() {
        return jsEngine;
    }

    @Override
    public void destroy() throws Exception {
        by.release();
        jsEngine.destroy();
        webDriver.quit();
    }

    protected RhinoEngine createJsEngine() {
        RequireProperties require = new RequireProperties();
        require.getModulePaths().add(new File(resourcesDir, "modules").toURI().toString());
        RhinoProperties rhinoProperties = new RhinoProperties();
        rhinoProperties.setRequire(require);
        RhinoEngine rhinoEngine = new RhinoEngine(rhinoProperties);
        rhinoEngine.put("by", by);
        rhinoEngine.putJson("config", configProperties.toJson());
        return rhinoEngine;
    }

    protected PropertySources loadConfiguration() throws Exception {
        File appConfigFile = new File(resourcesDir, "config/application.yml");
        Preconditions.checkState(appConfigFile.exists() && appConfigFile.isFile());
        YamlPropertySourceLoader loader = new YamlPropertySourceLoader();
        PropertySource<?> source = loader.load("application.yml", new FileSystemResource(appConfigFile), null);
        MutablePropertySources propertySources = new MutablePropertySources();
        propertySources.addFirst(source);
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

    protected WebModule createWebModule() {
        WebDebugInteractionPerformer performer = new WebDebugInteractionPerformer();
        return combine(baseModule(webDriver), positionModule(), conditionalModule(), interactableModule(performer), rhinoModule(), debugModule(performer));
    }

    protected WebElementsFactory<DefaultWebElements> createElementsFactory() {
        WebModule webModule = createWebModule();
        Builder<DefaultWebElements> builder = new WebElementsFactory.Builder<>();
        webModule.configure(builder);
        return builder.build();
    }

}
