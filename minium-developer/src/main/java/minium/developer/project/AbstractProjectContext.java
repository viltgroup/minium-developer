package minium.developer.project;

import static minium.developer.internal.webelements.SelectorGadgetWebModules.selectorGadgetModule;
import static minium.script.rhinojs.RhinoWebModules.rhinoModule;
import static minium.web.internal.WebModules.baseModule;
import static minium.web.internal.WebModules.combine;
import static minium.web.internal.WebModules.conditionalModule;
import static minium.web.internal.WebModules.debugModule;
import static minium.web.internal.WebModules.interactableModule;
import static minium.web.internal.WebModules.positionModule;

import java.io.File;

import minium.actions.debug.DebugInteractable;
import minium.cucumber.config.ConfigProperties;
import minium.developer.internal.webelements.SelectorGadgetWebElements;
import minium.script.js.JsEngine;
import minium.script.js.JsWebDriverFactory;
import minium.script.js.MiniumJsEngineAdapter;
import minium.script.rhinojs.JsFunctionWebElements;
import minium.script.rhinojs.RhinoEngine;
import minium.script.rhinojs.RhinoProperties;
import minium.script.rhinojs.RhinoProperties.RequireProperties;
import minium.script.rhinojs.RhinoWebDriverFactory;
import minium.web.CoreWebElements.DefaultWebElements;
import minium.web.WebLocator;
import minium.web.config.WebDriverFactory;
import minium.web.config.WebDriverProperties;
import minium.web.config.services.DriverServicesProperties;
import minium.web.internal.WebElementsFactory;
import minium.web.internal.WebElementsFactory.Builder;
import minium.web.internal.WebModule;
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
    private WebLocator<DefaultWebElements> by;

    public AbstractProjectContext(DriverServicesProperties driverServices, File projectDir, ConfigurableApplicationContext applicationContext) throws Exception {
        this.projectDir = projectDir;
        this.applicationContext = applicationContext;
        this.resourcesDir = new File(projectDir, "src/test/resources");
        this.propertySources = loadConfiguration();
        this.webDriverProperties = getAppConfigBean("minium.webdriver", WebDriverProperties.class);
        this.configProperties = getAppConfigBean("minium.config", ConfigProperties.class);
        this.webDriver = new WebDriverFactory(driverServices).create(webDriverProperties);
        this.by = new WebLocator<>(createElementsFactory().createRoot(), DefaultWebElements.class, JsFunctionWebElements.class, DebugInteractable.class, SelectorGadgetWebElements.class);
        this.jsEngine = createJsEngine();
    }

    public WebLocator<DefaultWebElements> by() {
        return by;
    }

    public Object eval(Evaluation evaluation) {
        return jsEngine.eval(evaluation.getExpression(), evaluation.getLineNumber());
    }

    public StackTraceElement[] getExecutionStackTrace() {
        return jsEngine.getExecutionStackTrace();
    }

    public boolean isRunning() {
        return jsEngine.isRunning();
    }

    public void cancel() {
        jsEngine.cancel();
    }

    @Override
    public void destroy() throws Exception {
        by.release();
        jsEngine.destroy();
        webDriver.quit();
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
        JsWebDriverFactory browsers = new RhinoWebDriverFactory(rhinoEngine);
        new MiniumJsEngineAdapter(by, browsers).adapt(rhinoEngine);
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
        return combine(baseModule(webDriver), positionModule(), conditionalModule(), interactableModule(performer), rhinoModule(), debugModule(performer), selectorGadgetModule());
    }

    protected WebElementsFactory<DefaultWebElements> createElementsFactory() {
        WebModule webModule = createWebModule();
        Builder<DefaultWebElements> builder = new WebElementsFactory.Builder<>();
        webModule.configure(builder);
        return builder.build();
    }

}
