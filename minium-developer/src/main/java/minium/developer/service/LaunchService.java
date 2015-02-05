package minium.developer.service;

import static java.lang.String.format;

import java.io.File;
import java.io.IOException;
import java.net.URI;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

import minium.cucumber.MiniumConfiguration;
import minium.cucumber.MiniumCucumber;
import minium.cucumber.rest.SimpleGlue;
import minium.developer.cucumber.reports.ReporterParser;
import minium.developer.web.rest.LaunchInfo;
import minium.developer.web.rest.dto.StepDefinitionDTO;
import minium.script.js.JsVariablePostProcessor;
import net.masterthought.cucumber.json.Feature;

import org.apache.commons.io.FileUtils;
import org.junit.runner.Result;
import org.junit.runner.RunWith;
import org.junit.runner.Runner;
import org.junit.runner.notification.Failure;
import org.junit.runner.notification.RunListener;
import org.junit.runner.notification.RunNotifier;
import org.junit.runner.notification.StoppedByUserException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.SpringApplicationConfiguration;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.messaging.core.MessageSendingOperations;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;
import org.springframework.stereotype.Service;

import com.google.common.base.Joiner;
import com.google.common.base.Throwables;
import com.google.common.collect.Lists;

import cucumber.runtime.Backend;
import cucumber.runtime.RuntimeOptions;
import cucumber.runtime.StepDefinition;

@Service
public class LaunchService {

	@RunWith(MiniumCucumber.class)
	@SpringApplicationConfiguration(classes = MiniumConfiguration.class)
	public static class GenericTest {
	}

	public MessageSendingOperations<String> messagingTemplate;

	private static final Logger LOGGER = LoggerFactory.getLogger(LaunchService.class);

	private Map<String, Thread> threadList;

	private ThreadPoolTaskExecutor executor;
	private ThreadGroup threadGroup;
	private ExecutorService executorService;

	private String resourcesBaseDir = "src/test/resources";
	private ReporterParser reporter = new ReporterParser();
	private RunNotifier notifier;

	private ConfigurableApplicationContext applicationContext;
	private JsVariablePostProcessor variablePostProcessor;

	@Autowired
	public LaunchService(final MessageSendingOperations<String> messagingTemplate, ConfigurableApplicationContext applicationContext,
			JsVariablePostProcessor variablePostProcessor) {
		this.messagingTemplate = messagingTemplate;
		this.applicationContext = applicationContext;
		this.variablePostProcessor = variablePostProcessor;
		this.threadList = Collections.synchronizedMap(new HashMap<String, Thread>());
		executor = new ThreadPoolTaskExecutor();
		executor.initialize();
		threadGroup = new ThreadGroup("cucumberLaunchers");
		executorService = Executors.newSingleThreadExecutor();
	}

	public Feature launch(URI baseUri, LaunchInfo launchInfo, String sessionID) throws IOException {
        URI resourceDir = launchInfo.getFileProps().getRelativeUri();

        File tmpFile = File.createTempFile("cucumber", ".json");

        String path;
        if (launchInfo.getLine() == null || launchInfo.getLine().get(0) == 1) {
            path = format("%s/%s ", resourcesBaseDir, resourceDir.getPath());
        } else {
            String lines = Joiner.on(":").join(launchInfo.getLine());
            path = format("%s/%s:%s", resourcesBaseDir, resourceDir.getPath(), lines);
        }

        String cucumberOptions = format("%s --plugin json:%s --plugin %s", path, tmpFile.getAbsolutePath(), CucumberLiveReporter.class.getName());
        LOGGER.info("About to launch cucumber test with options: {}", cucumberOptions);

        System.setProperty("cucumber.options", cucumberOptions);
        System.setProperty("spring.profiles.active", "pupino");

        try {
            notifier = new RunNotifier();

            Result result = run(sessionID);

            for (Failure failure : result.getFailures()) {
                LOGGER.error("{} failed", failure.getTestHeader(), failure.getException());
            }
        } catch (StoppedByUserException e) {
            LOGGER.debug("Stopped by user ", e);
		} catch (Exception e) {
			LOGGER.error("Something went worng ", e);
        }
        String content = FileUtils.readFileToString(tmpFile);
		Feature feature = null;
		// check if the execution as results
		// to present the result in the interface
		if (!content.equals("")) {
			List<Feature> features = reporter.parseJsonResult(content);

			if (features != null){
				feature = features.get(0);
				feature.processSteps();
			}
		}

		return feature;
	}

	private Result run(String sessionID) {
		try {
			Result result = new Result();
			RunListener resultListener = result.createListener();
			RunListener pupinoListener = new CucumberJUnitListener(messagingTemplate, sessionID);
			notifier.addFirstListener(resultListener);
			notifier.addListener(pupinoListener);

			Runner runner = new MiniumCucumber(GenericTest.class, applicationContext.getAutowireCapableBeanFactory());
			try {
				notifier.fireTestRunStarted(runner.getDescription());
				runner.run(notifier);
				notifier.fireTestRunFinished(result);
			} finally {
				notifier.removeListener(resultListener);
				notifier.removeListener(pupinoListener);
			}
			return result;
		} catch (Exception e) {
			throw Throwables.propagate(e);
		}
	}

	public List<StepDefinitionDTO> getStepDefinitions() {
		try {
			MiniumCucumber miniumCucumber = new MiniumCucumber(GenericTest.class, applicationContext.getAutowireCapableBeanFactory());
			List<Backend> backends = miniumCucumber.getAllBackends();
			RuntimeOptions runtimeOptions = miniumCucumber.getRuntimeOptions();

			SimpleGlue glue = new SimpleGlue();
			for (Backend backend : backends) {
				backend.loadGlue(glue, runtimeOptions.getGlue());
			}

			List<StepDefinitionDTO> results = Lists.newArrayList();
			for (StepDefinition stepDefinition : glue.getStepDefinitions().values()) {
				results.add(new StepDefinitionDTO(stepDefinition));
			}
			return results;
		} catch (Exception e) {
			throw Throwables.propagate(e);
		}
	}

	public void stopLaunch() throws SecurityException, NoSuchFieldException, IllegalArgumentException, IllegalAccessException {
		if (notifier != null)
			notifier.pleaseStop();
	}

}
