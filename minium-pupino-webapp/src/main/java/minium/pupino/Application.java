package minium.pupino;

import java.io.IOException;
import java.util.Arrays;

import javax.annotation.PostConstruct;
import javax.inject.Inject;

import minium.pupino.browser.BrowserLauncher;
import minium.pupino.config.Constants;

import org.apache.catalina.Context;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.BeansException;
import org.springframework.boot.actuate.autoconfigure.MetricFilterAutoConfiguration;
import org.springframework.boot.actuate.autoconfigure.MetricRepositoryAutoConfiguration;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.context.embedded.ConfigurableEmbeddedServletContainer;
import org.springframework.boot.context.embedded.EmbeddedServletContainerCustomizer;
import org.springframework.boot.context.embedded.tomcat.TomcatContextCustomizer;
import org.springframework.boot.context.embedded.tomcat.TomcatEmbeddedServletContainerFactory;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.core.env.Environment;
import org.springframework.core.env.SimpleCommandLinePropertySource;

@ComponentScan
@EnableAutoConfiguration(exclude = { MetricFilterAutoConfiguration.class, MetricRepositoryAutoConfiguration.class })
public class Application implements EmbeddedServletContainerCustomizer {

	private final Logger log = LoggerFactory.getLogger(Application.class);

	@Inject
	private Environment env;

	/**
	 * Initializes pupino.
	 * <p/>
	 * Spring profiles can be configured with a program arguments
	 * --spring.profiles.active=your-active-profile
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
				.headless(Boolean.getBoolean("java.awt.headless"))
				.profiles("pupino");

		SimpleCommandLinePropertySource source = new SimpleCommandLinePropertySource(args);

		// Check if the selected profile has been set as argument.
		// if not the development profile will be added
		addDefaultProfile(appBuilder, source);

		ConfigurableApplicationContext context = appBuilder.run(args);
		maybeLaunchBrowser(context);
	}

	/**
	 * Set a default profile if it has not been set
	 */
	private static void addDefaultProfile(SpringApplicationBuilder appBuilder, SimpleCommandLinePropertySource source) {
		if (!source.containsProperty("spring.profiles.active")) {
			appBuilder.profiles(Constants.SPRING_PROFILE_DEVELOPMENT);
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
}