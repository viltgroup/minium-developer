package minium.developer.project;

import minium.developer.fs.service.FileSystemService;
import minium.web.CoreWebElements.DefaultWebElements;
import minium.web.DelegatorWebDriver;
import minium.web.actions.Browser;
import minium.web.actions.WebDriverBrowser;
import minium.web.config.WebDriverFactory;
import minium.web.config.services.DriverServicesProperties;
import minium.web.internal.WebModule;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.config.ConfigurableBeanFactory;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.*;
import org.springframework.web.context.annotation.RequestScope;
import org.springframework.web.context.annotation.SessionScope;

import javax.servlet.http.HttpServletRequest;
import java.io.File;

import static minium.developer.internal.webelements.SelectorGadgetWebModules.selectorGadgetModule;
import static minium.script.rhinojs.RhinoWebModules.rhinoModule;
import static minium.web.internal.WebModules.*;

@Configuration
@EnableConfigurationProperties
public class ProjectContextConfiguration {

    private static final Logger LOGGER = LoggerFactory.getLogger(ProjectContextConfiguration.class);

    private static final String PROJECT_HEADER = "X-Project";

    @Profile("!remote")
    @Configuration
    public static class LocalProjectContextConfiguration {

        @Bean
        @ConfigurationProperties(prefix = "minium.project")
        public ProjectProperties projectConfiguration() {
                return new ProjectProperties();
        }

        @Bean
        @Autowired
        @SessionScope
        public FileSystemService fileSystemService(ProjectProperties projectConfiguration) {
            return new FileSystemService(projectConfiguration.getResourcesDir());
        }

        @Autowired
        @Bean
        @SessionScope
        public Workspace workspace(ProjectProperties projConfiguration) throws Exception {
            return new Workspace(projectContext(projConfiguration));
        }

        @Bean
        @ConfigurationProperties(prefix = "minium.driverservices")
        public DriverServicesProperties driverServicesProperties() {
            return new DriverServicesProperties();
        }

        @Autowired
        @Bean
        @Scope(value = ConfigurableBeanFactory.SCOPE_PROTOTYPE)
        public AbstractProjectContext projectContext(ProjectProperties projConfiguration) throws Exception {
            if (projConfiguration.isCucumberProject()) {
                return new CucumberProjectContext(projConfiguration);
            } else if (projConfiguration.isAutomatorProject()) {
                return new RhinoProjectContext(projConfiguration);
            }
            LOGGER.warn("Project at {} is not a valid project", projConfiguration.getDir());
            return new RhinoProjectContext(projConfiguration);
        }

        @Autowired
        @Bean
        public WebDriverFactory webDriverFactory(DriverServicesProperties driverServicesProperties) throws Exception {
            return new WebDriverFactory(driverServicesProperties);
        }

        @Autowired
        @Bean(destroyMethod = "quit")
        public DelegatorWebDriver delegatorWebDriver() {
            return new DelegatorWebDriver();
        }

        @Lazy
        @Autowired
        @Bean(destroyMethod = "quit")
        public Browser<DefaultWebElements> browser(DelegatorWebDriver delegatorWebDriver) {
            return new WebDriverBrowser<>(delegatorWebDriver, DefaultWebElements.class, createWebModule(delegatorWebDriver));
        }

        protected WebModule createWebModule(DelegatorWebDriver delegatorWebDriver) {
            return combine(baseModule(delegatorWebDriver), positionModule(), conditionalModule(), interactableModule(), rhinoModule(), debugModule(), selectorGadgetModule());
        }
    }


    @Profile("remote")
    @Configuration
    public static class RemoteProjectContextConfiguration {
        @Bean
        @ConfigurationProperties(prefix = "minium.remote")
        public RemoteProperties remoteProperties() {
            return new RemoteProperties();
        }

        @Bean
        @RequestScope
        public ProjectProperties projectConfiguration(RemoteProperties remoteProperties, HttpServletRequest req) {
            String projectName = req.getHeader(PROJECT_HEADER) == null ?
                req.getParameter("project") :
                req.getHeader(PROJECT_HEADER);
            return new ProjectProperties(projectName != null ?
                new File(remoteProperties.getWorkspaceDir(), projectName) :
                null);
        }

        @Bean
        @Autowired
        @RequestScope
        public FileSystemService fileSystemService(ProjectProperties projectProperties, HttpServletRequest req) {
            String projectName = req.getHeader(PROJECT_HEADER) == null ?
                req.getParameter("project") :
                req.getHeader(PROJECT_HEADER);
             return new FileSystemService(projectName, projectProperties.getResourcesDir());
        }

        @Autowired
        @Bean
        @RequestScope
        public Workspace workspace(ProjectProperties projConfiguration) throws Exception {
            return new Workspace(projectContext(projConfiguration));
        }

        @Autowired
        @Bean
        @RequestScope
        public AbstractProjectContext projectContext(ProjectProperties projConfiguration) throws Exception {
            return new CucumberProjectContext(projConfiguration);
        }
    }
}
