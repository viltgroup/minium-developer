package minium.pupino.service;

import static java.lang.String.format;

import java.io.File;
import java.io.IOException;
import java.net.URI;
import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Set;

import minium.pupino.cucumber.JsVariablePostProcessor;
import minium.pupino.cucumber.MiniumBackend;
import minium.pupino.cucumber.MiniumCucumber;
import minium.pupino.cucumber.MiniumRhinoTestContextManager;
import minium.pupino.cucumber.MiniumRhinoTestsSupport;
import minium.pupino.domain.LaunchInfo;
import minium.pupino.jenkins.ReporterParser;
import minium.pupino.web.rest.StepDefinitionDTO;
import net.masterthought.cucumber.json.Feature;

import org.apache.commons.io.FileUtils;
import org.junit.runner.Result;
import org.junit.runner.RunWith;
import org.junit.runner.Runner;
import org.junit.runner.notification.Failure;
import org.junit.runner.notification.RunListener;
import org.junit.runner.notification.RunNotifier;
import org.junit.runner.notification.StoppedByUserException;
import org.mozilla.javascript.Context;
import org.mozilla.javascript.tools.shell.Global;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.config.AutowireCapableBeanFactory;
import org.springframework.beans.factory.config.BeanDefinition;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.context.annotation.ClassPathScanningCandidateComponentProvider;
import org.springframework.core.type.filter.AnnotationTypeFilter;
import org.springframework.messaging.core.MessageSendingOperations;
import org.springframework.stereotype.Service;

import com.google.common.base.Joiner;
import com.google.common.base.Preconditions;
import com.google.common.base.Throwables;
import com.google.common.collect.ImmutableList;
import com.google.common.collect.Iterables;
import com.google.common.collect.Lists;
import com.google.common.collect.Sets;

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
public class LaunchService {

    public static MessageSendingOperations<String> messagingTemplate;

    private static final Logger LOGGER = LoggerFactory.getLogger(LaunchService.class);

    private String resourcesBaseDir = "src/test/resources";
    private Class<?> cachedTestClass;
    private ReporterParser reporter = new ReporterParser();
    private RunNotifier notifier;

    private ConfigurableApplicationContext applicationContext;
    private JsVariablePostProcessor variablePostProcessor;

    @Autowired
    public LaunchService(final MessageSendingOperations<String> messagingTemplate, ConfigurableApplicationContext applicationContext, JsVariablePostProcessor variablePostProcessor) {
        LaunchService.messagingTemplate = messagingTemplate;
        this.applicationContext = applicationContext;
        this.variablePostProcessor = variablePostProcessor;
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

        String cucumberOptions = format("%s --plugin json:%s --plugin %s", path, tmpFile.getAbsolutePath(), PupinoReporter.class.getName());
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
        }
        String content = FileUtils.readFileToString(tmpFile);
        List<Feature> features = reporter.parseJsonResult(content);
        features.get(0).processSteps();
        return features.get(0);
    }

    private Result run(String sessionID) {
        try {
            Result result = new Result();
            RunListener resultListener = result.createListener();
            RunListener pupinoListener = new PupinoJUnitListener(messagingTemplate, sessionID);
            notifier.addFirstListener(resultListener);
            notifier.addListener(pupinoListener);

            Class<?> testClass = getTestClass();
            Runner runner = new MiniumCucumber(testClass, applicationContext.getAutowireCapableBeanFactory());
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

    public List<StepDefinitionDTO> getStepDefinitions() throws IOException {
        Class<?> testClass = getTestClass();
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
        Object testInstance = null;

        try {
            testInstance = getTestClass().newInstance();
            if (applicationContext instanceof ConfigurableApplicationContext) {
                ((AutowireCapableBeanFactory) applicationContext).autowireBean(testInstance);
            }
        } catch (Exception e) {
            throw Throwables.propagate(e);
        }

        Context cx = Context.enter();
        Global scope = new Global(cx);
        MiniumRhinoTestsSupport support = new MiniumRhinoTestsSupport(classLoader, cx, scope, applicationContext.getAutowireCapableBeanFactory(), variablePostProcessor);
        support.initialize();

        MiniumBackend backend = new MiniumBackend(resourceLoader, cx, scope);
        return ImmutableList.<Backend>builder().add(backend).addAll(backends.values()).build();
    }

    public void stopLaunch() throws SecurityException, NoSuchFieldException, IllegalArgumentException, IllegalAccessException {
        if (notifier != null) notifier.pleaseStop();
    }

    protected Class<?> getTestClass() {
        if (cachedTestClass == null) {
            ClassPathScanningCandidateComponentProvider scanner = new ClassPathScanningCandidateComponentProvider(false);
            scanner.setResourcePattern("**/*IT.class");
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
            cachedTestClass = Iterables.getFirst(results, null);
        }
        return cachedTestClass;
    }

}
