package minium.pupino.service;

import static java.lang.String.format;

import java.io.File;
import java.io.IOException;
import java.lang.reflect.Field;
import java.net.URI;
import java.util.Set;

import minium.pupino.domain.LaunchInfo;

import org.junit.runner.JUnitCore;
import org.junit.runner.Result;
import org.junit.runner.RunWith;
import org.junit.runner.notification.Failure;
import org.junit.runner.notification.RunNotifier;
import org.junit.runner.notification.StoppedByUserException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.config.BeanDefinition;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.ClassPathScanningCandidateComponentProvider;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.core.type.filter.AnnotationTypeFilter;
import org.springframework.messaging.core.MessageSendingOperations;
import org.springframework.stereotype.Service;

import com.google.common.base.Joiner;
import com.google.common.collect.Sets;
import com.google.common.io.Files;
import com.vilt.minium.script.cucumber.MiniumCucumber;

@Service
@ConfigurationProperties(prefix = "launcher", locations = "classpath:pupino.yml", ignoreUnknownFields = false)
public class LaunchService {

	public static MessageSendingOperations<String> messagingTemplate;

	private JUnitCore runner;

	private String resourcesBaseDir = "src/test/resources";
    private Class<?>[] testClasses;

	private static final Logger LOGGER = LoggerFactory.getLogger(LaunchService.class);

	@Autowired
	public LaunchService(final MessageSendingOperations<String> messagingTemplate) {
		LaunchService.messagingTemplate = messagingTemplate;
		testClasses = findTestClasses();
	}

	public Resource launch(URI baseUri, LaunchInfo launchInfo) throws IOException {
		URI resourceDir = launchInfo.getFileProps().getRelativeUri();

		File tmpFile = File.createTempFile("cucumber", ".json");

		String path;
		if (launchInfo.getLine() == null || launchInfo.getLine().get(0) == 1) {
			path = format("%s/%s ", resourcesBaseDir, resourceDir.getPath());
		} else {
			String lines = Joiner.on(":").join(launchInfo.getLine());
			path = format("%s/%s:%s", resourcesBaseDir, resourceDir.getPath(), lines);
		}

		String cucumberOptions = format("%s --plugin json:%s --plugin %s", path, tmpFile.getAbsolutePath(), PupinoReporter.class.getName());
		LOGGER.info("About to launch cucumber test with options: {}", cucumberOptions);

		System.setProperty("cucumber.options", cucumberOptions);
		System.setProperty("spring.profiles.active", "pupino");

		Result result = null;
		try {
			runner = new JUnitCore();
			runner.addListener(new PupinoJUnitListener(messagingTemplate));
			result = runner.run(testClasses);

			for (Failure failure : result.getFailures()) {
				LOGGER.error("{} failed", failure.getTestHeader(), failure.getException());
			}
		} catch (StoppedByUserException e) {
			LOGGER.debug("Stopped by user ", e);
		}

		return new FileSystemResource(tmpFile);
	}

	public Resource dotcucumber() throws IOException {
		File tmpFile = Files.createTempDir();
		String cucumberOptions = format("--dry-run --dotcucumber %s", tmpFile.getAbsolutePath());

		LOGGER.info("Running with dotcucumber: {}", cucumberOptions);

		System.setProperty("cucumber.options", cucumberOptions);
		Result result = new JUnitCore().run(testClasses);

		for (Failure failure : result.getFailures()) {
			LOGGER.error("{} failed", failure.getTestHeader(), failure.getException());
		}

		return new FileSystemResource(new File(tmpFile, "stepdefs.json"));
	}

	public void stopLaunch() throws SecurityException, NoSuchFieldException, IllegalArgumentException, IllegalAccessException {
		Field field = JUnitCore.class.getDeclaredField("fNotifier");
		field.setAccessible(true);
		RunNotifier runNotifier = (RunNotifier) field.get(runner);
		runNotifier.pleaseStop();
	}

    protected Class<?>[] findTestClasses(){
        ClassPathScanningCandidateComponentProvider scanner = new ClassPathScanningCandidateComponentProvider(false);
        scanner.addIncludeFilter(new AnnotationTypeFilter(RunWith.class));
        Set<BeanDefinition> components = scanner.findCandidateComponents("");
        Set<Class<?>> results = Sets.newHashSet();
        for (BeanDefinition component : components) {
            if (!component.isAbstract()) {
                try {
                    Class<?> testClass = Thread.currentThread().getContextClassLoader().loadClass(component.getBeanClassName());
                    RunWith runWithAnnotation = testClass.getAnnotation(RunWith.class);
                    if (runWithAnnotation.value() == MiniumCucumber.class) {
                        LOGGER.debug("Found Minium Cucumber test class {}", component.getBeanClassName());
                        results.add(testClass);
                    }
                } catch (ClassNotFoundException e) {
                    LOGGER.debug("Class {} not found, skipping", component.getBeanClassName());
                }
            }
        }
        if (results.isEmpty()) {
            LOGGER.warn("No Minium Cucumber test class found");
        }
        return results.toArray(new Class<?>[results.size()]);
    }

}
