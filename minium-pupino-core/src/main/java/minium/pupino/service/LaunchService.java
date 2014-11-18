package minium.pupino.service;

import static java.lang.String.format;

import java.io.File;
import java.io.IOException;
import java.lang.reflect.Field;
import java.net.URI;
import java.util.List;

import minium.pupino.domain.LaunchInfo;
import minium.pupino.utils.Utils;

import org.junit.runner.JUnitCore;
import org.junit.runner.Result;
import org.junit.runner.notification.Failure;
import org.junit.runner.notification.RunNotifier;
import org.junit.runner.notification.StoppedByUserException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.messaging.core.MessageSendingOperations;
import org.springframework.stereotype.Service;

import com.google.common.base.Function;
import com.google.common.base.Throwables;
import com.google.common.collect.FluentIterable;
import com.google.common.collect.Lists;
import com.google.common.io.Files;

@Service
@ConfigurationProperties(prefix = "launcher", locations = "classpath:pupino.yml", ignoreUnknownFields = false)
public class LaunchService {

	public static MessageSendingOperations<String> messagingTemplate;

	private JUnitCore runner;

	private static final Logger LOGGER = LoggerFactory.getLogger(LaunchService.class);

	private List<String> classNames = Lists.newArrayList();

	public List<String> getClassNames() {
		return classNames;
	}

	public Class<?>[] getClasses() {
		List<Class<?>> classes = FluentIterable.from(classNames).transform(new Function<String, Class<?>>() {
			@Override
			public Class<?> apply(String input) {
				try {
					return Class.forName(input);
				} catch (ClassNotFoundException e) {
					throw Throwables.propagate(e);
				}
			}
		}).toList();
		return classes.toArray(new Class<?>[classes.size()]);
	}

	@Autowired
	public LaunchService(final MessageSendingOperations<String> messagingTemplate) {
		LaunchService.messagingTemplate = messagingTemplate;
	}

	public Resource launch(URI baseUri, LaunchInfo launchInfo) throws IOException {
		URI resourceDir = launchInfo.getFileProps().getRelativeUri();

		File tmpFile = File.createTempFile("cucumber", ".json");

		String path;
		if (launchInfo.getLine() == null || launchInfo.getLine().get(0) == 1) {
			path = format("classpath:%s ", resourceDir.getPath());
		} else {
			String lines = Utils.array2String(launchInfo.getLine());
			path = format("classpath:%s:%s", resourceDir.getPath(), lines);
		}

		String cucumberOptions = format("%s --format json:%s --format %s", path, tmpFile.getAbsolutePath(), PupinoReporter.class.getName());
		LOGGER.info("About to launch cucumber test with options: {}", cucumberOptions);

		System.setProperty("cucumber.options", cucumberOptions);

		Result result = null;
		try {
			runner = new JUnitCore();
			runner.addListener(new PupinoJUnitListener(messagingTemplate));
			result = runner.run(getClasses());

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
		Result result = new JUnitCore().run(getClasses());

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

}
