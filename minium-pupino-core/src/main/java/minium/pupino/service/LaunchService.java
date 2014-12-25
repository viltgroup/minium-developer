package minium.pupino.service;

import static java.lang.String.format;

import java.io.File;
import java.io.IOException;
import java.lang.reflect.Field;
import java.net.URI;
import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Set;

import minium.pupino.domain.LaunchInfo;
import minium.pupino.web.rest.StepDefinitionDTO;

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
import com.google.common.base.Preconditions;
import com.google.common.collect.ImmutableList;
import com.google.common.collect.Iterables;
import com.google.common.collect.Lists;
import com.google.common.collect.Sets;
import com.vilt.minium.script.cucumber.MiniumBackend;
import com.vilt.minium.script.cucumber.MiniumCucumber;
import com.vilt.minium.script.test.impl.MiniumRhinoTestContextManager;

import cucumber.runtime.Backend;
import cucumber.runtime.RuntimeOptions;
import cucumber.runtime.RuntimeOptionsFactory;
import cucumber.runtime.StepDefinition;
import cucumber.runtime.io.MultiLoader;
import cucumber.runtime.io.ResourceLoader;
import cucumber.runtime.rest.BackendConfigurer;
import cucumber.runtime.rest.BackendRegistry;
import cucumber.runtime.rest.SimpleGlue;

@Service
@ConfigurationProperties(prefix = "launcher", locations = "classpath:pupino.yml", ignoreUnknownFields = false)
public class LaunchService {

	public static MessageSendingOperations<String> messagingTemplate;

	private static final Logger LOGGER = LoggerFactory.getLogger(LaunchService.class);

	private JUnitCore runner;

	private String resourcesBaseDir = "src/test/resources";
	private Class<?> testClass;



	@Autowired
	public LaunchService(final MessageSendingOperations<String> messagingTemplate) {
		LaunchService.messagingTemplate = messagingTemplate;
		testClass = findTestClass();
	}

	public Resource launch(URI baseUri, LaunchInfo launchInfo) throws IOException {

		File tmpFile = File.createTempFile("cucumber", ".json");

		URI resourceDir = launchInfo.getFileProps().getRelativeUri();
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
			result = runner.run(testClass);

			for (Failure failure : result.getFailures()) {
				LOGGER.error("{} failed", failure.getTestHeader(), failure.getException());
			}
		} catch (StoppedByUserException e) {
			LOGGER.debug("Stopped by user ", e);
		}

		return new FileSystemResource(tmpFile);
	}

	public List<StepDefinitionDTO> getStepDefinitions() throws IOException {
        MiniumRhinoTestContextManager testContextManager = new MiniumRhinoTestContextManager(testClass);
        ResourceLoader resourceLoader = new MultiLoader(testClass.getClassLoader());
        List<Backend> backends = getBackends(testContextManager, testClass.getClassLoader(), resourceLoader);
        RuntimeOptions runtimeOptions = new RuntimeOptionsFactory(testClass).create();
        SimpleGlue glue = new SimpleGlue();
        for (Backend backend : backends) {
            backend.loadGlue(glue, runtimeOptions.getGlue());
        }

        List<StepDefinitionDTO> results = Lists.newArrayList();
        for (StepDefinition stepDefinition : glue.getStepDefinitions().values()) {
            results.add(new StepDefinitionDTO(stepDefinition));
        }
        return results;
	}

	private List<Backend> getBackends(MiniumRhinoTestContextManager testContextManager, ClassLoader classLoader, ResourceLoader resourceLoader) throws IOException {
        BackendRegistry backendRegistry = new BackendRegistry();
        Collection<BackendConfigurer> backendConfigurers = testContextManager.getBeanFactory().getBeansOfType(BackendConfigurer.class).values();

        for (BackendConfigurer backendConfigurer : backendConfigurers) {
            backendConfigurer.addBackends(backendRegistry);
        }

        Map<String, Backend> backends = backendRegistry.getAll();
        if (LOGGER.isDebugEnabled()) {
            for (Entry<String, Backend> entry : backends.entrySet()) {
                LOGGER.debug("Found backend {}", entry.getKey());
            }
        }

        MiniumBackend backend = new MiniumBackend(resourceLoader, classLoader, testContextManager);
        return ImmutableList.<Backend>builder().add(backend).addAll(backends.values()).build();
    }

    public void stopLaunch() throws SecurityException, NoSuchFieldException, IllegalArgumentException, IllegalAccessException {
		Field field = JUnitCore.class.getDeclaredField("fNotifier");
		field.setAccessible(true);
		RunNotifier runNotifier = (RunNotifier) field.get(runner);
		runNotifier.pleaseStop();
	}

    protected Class<?> findTestClass() {
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
        Preconditions.checkState(!results.isEmpty(), "No Minium Cucumber test class found");
        Preconditions.checkState(results.size() == 1, "More than one Minium Cucumber test class found: %s", Joiner.on(", ").join(results));
        return Iterables.getFirst(results, null);
    }

}
