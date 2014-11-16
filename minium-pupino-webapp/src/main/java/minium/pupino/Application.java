package minium.pupino;

import java.io.IOException;
import java.util.Arrays;

import javax.annotation.PostConstruct;
import javax.inject.Inject;

import minium.pupino.config.Constants;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.actuate.autoconfigure.MetricFilterAutoConfiguration;
import org.springframework.boot.actuate.autoconfigure.MetricRepositoryAutoConfiguration;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.core.env.Environment;
import org.springframework.core.env.SimpleCommandLinePropertySource;

@ComponentScan
@EnableAutoConfiguration(exclude = {MetricFilterAutoConfiguration.class, MetricRepositoryAutoConfiguration.class})
public class Application {
	
	private final Logger log = LoggerFactory.getLogger(Application.class);

    @Inject
    private Environment env;

    /**
     * Initializes pupino.
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

    /**
     * Main method, used to run the application.
     */
    public static void main(String[] args) {
        SpringApplicationBuilder appBuilder = new SpringApplicationBuilder(Application.class)
			.showBanner(true)
			.profiles("pupino");

        SimpleCommandLinePropertySource source = new SimpleCommandLinePropertySource(args);

        // Check if the selected profile has been set as argument.
        // if not the development profile will be added
        addDefaultProfile(appBuilder, source);

        appBuilder.run(args);
    }

    /**
     * Set a default profile if it has not been set
     */
    private static void addDefaultProfile(SpringApplicationBuilder appBuilder, SimpleCommandLinePropertySource source) {
        if (!source.containsProperty("spring.profiles.active")) {
            appBuilder.profiles(Constants.SPRING_PROFILE_DEVELOPMENT);
        }
    }
}