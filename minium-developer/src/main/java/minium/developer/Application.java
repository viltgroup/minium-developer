package minium.developer;

import java.io.IOException;
import java.util.Arrays;

import javax.annotation.PostConstruct;
import javax.inject.Inject;

import minium.developer.browser.BrowserLauncher;
import minium.developer.config.Constants;
import minium.tools.fs.config.FileSystemConfiguration;

import org.apache.catalina.Context;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.BeansException;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.context.embedded.ConfigurableEmbeddedServletContainer;
import org.springframework.boot.context.embedded.EmbeddedServletContainerCustomizer;
import org.springframework.boot.context.embedded.tomcat.TomcatContextCustomizer;
import org.springframework.boot.context.embedded.tomcat.TomcatEmbeddedServletContainerFactory;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;
import org.springframework.core.env.Environment;
import org.springframework.core.env.SimpleCommandLinePropertySource;

@Configuration
@ComponentScan
@EnableAutoConfiguration
@Import(FileSystemConfiguration.class)
public class Application implements EmbeddedServletContainerCustomizer {

    private final Logger log = LoggerFactory.getLogger(Application.class);

    @Inject
    private Environment env;

    /**
     * Initializes miniumdev.
     * <p/>
     * Spring profiles can be configured with a program arguments --spring.profiles.active=your-active-profile
     * <p/>
     */
    @PostConstruct
    public void initApplication() throws IOException {
        if (env.getActiveProfiles().length == 0) {
            log.warn("No Spring profile configured, running with default configuration");
        } else {
            log.info("Running with Spring profile(s) : {}", Arrays.toString(env.getActiveProfiles()));
        }
    }

    // to set the value of httpOnly = false
    // to allow to access jsessionID in javascript
    // http://stackoverflow.com/questions/22428233/turn-off-httponly-spring-boot
    @Override
    public void customize(final ConfigurableEmbeddedServletContainer container) {
        ((TomcatEmbeddedServletContainerFactory) container).addContextCustomizers(new TomcatContextCustomizer() {

            @Override
            public void customize(Context context) {
                context.setUseHttpOnly(false);
            }
        });
    }

    /**
     * Main method, used to run the application.
     */
    public static void main(String[] args) {
        SpringApplication app  = new SpringApplicationBuilder(Application.class)
            .showBanner(true)
            .profiles("minium-developer")
            .headless(Boolean.getBoolean("java.awt.headless"))
            .build();

        SimpleCommandLinePropertySource source = new SimpleCommandLinePropertySource(args);

        // Check if the selected profile has been set as argument.
        // if not the development profile will be added
        addDefaultProfile(app, source);

        ConfigurableApplicationContext context = app.run(args);
        maybeLaunchBrowser(context);
    }

    /**
     * Set a default profile if it has not been set
     */
    private static void addDefaultProfile(SpringApplication app, SimpleCommandLinePropertySource source) {
        if (!source.containsProperty("spring.profiles.active")) {
            app.setAdditionalProfiles(Constants.SPRING_PROFILE_DEVELOPMENT);
        }
    }

    private static void maybeLaunchBrowser(ConfigurableApplicationContext context) {
        try {
            BrowserLauncher browserLauncher = context.getBean(BrowserLauncher.class);
            browserLauncher.launch();
        } catch (BeansException e) {
            // not a big deal
        }
    }
}
