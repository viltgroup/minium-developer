package minium.developer.project;

import static java.lang.String.format;

import java.io.File;
import java.io.IOException;
import java.net.URI;
import java.util.List;

import minium.cucumber.MiniumBackend;
import minium.cucumber.config.CucumberProperties;
import minium.cucumber.config.CucumberProperties.OptionsProperties;
import minium.cucumber.config.CucumberProperties.RemoteBackendProperties;
import minium.cucumber.config.CucumberProperties.SnippetProperties;
import minium.cucumber.internal.RuntimeBuilder;
import minium.cucumber.rest.RemoteBackend;
import minium.cucumber.rest.SimpleGlue;
import minium.developer.cucumber.reports.ReporterParser;
import minium.developer.service.CucumberLiveReporter;
import minium.developer.web.rest.LaunchInfo;
import minium.developer.web.rest.dto.StepDefinitionDTO;
import minium.script.rhinojs.RhinoEngine;
import net.masterthought.cucumber.json.Feature;

import org.apache.commons.io.FileUtils;
import org.junit.runner.notification.StoppedByUserException;
import org.mozilla.javascript.Context;
import org.mozilla.javascript.Scriptable;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.messaging.core.MessageSendingOperations;

import com.google.common.base.Joiner;
import com.google.common.base.Throwables;
import com.google.common.collect.ImmutableList;
import com.google.common.collect.Lists;

import cucumber.runtime.Backend;
import cucumber.runtime.Runtime;
import cucumber.runtime.RuntimeOptions;
import cucumber.runtime.StepDefinition;
import cucumber.runtime.io.MultiLoader;
import cucumber.runtime.io.ResourceLoader;

public class CucumberProjectContext extends AbstractProjectContext {

    private static final Logger LOGGER = LoggerFactory.getLogger(CucumberProjectContext.class);

    private MessageSendingOperations<String> messagingTemplate;
    private CucumberProperties projectCucumberProperties;
    private RhinoEngine cucumberEngine;

    public CucumberProjectContext(File projectDir, ConfigurableApplicationContext applicationContext, MessageSendingOperations<String> messagingTemplate) throws Exception {
        super(projectDir, applicationContext);
        this.messagingTemplate = messagingTemplate;
        this.projectCucumberProperties = getAppConfigBean("minium.cucumber", CucumberProperties.class);
    }

    public Feature launchCucumber(LaunchInfo launchInfo, final String sessionId) throws IOException {
        URI file = launchInfo.getFileProps().getRelativeUri();

        File featureFile = new File(resourcesDir, file.getPath());

        String featurePath;
        if (launchInfo.getLine() == null || launchInfo.getLine().get(0) == 1) {
            featurePath = featureFile.getAbsolutePath();
        } else {
            String lines = Joiner.on(":").join(launchInfo.getLine());
            featurePath = format("%s:%s", featureFile.getAbsolutePath(), lines);
        }
        File resultsFile = File.createTempFile("cucumber", ".json");

        CucumberProperties cucumberProperties = createEvaluationCucumberProperties(resultsFile, featurePath);

        try {
            List<Throwable> failures = run(cucumberProperties, sessionId);

            for (Throwable failure : failures) {
                LOGGER.error("Feature {} failed", featurePath, failure);
            }
        } catch (StoppedByUserException e) {
            LOGGER.debug("Stopped by user ", e);
        } catch (Exception e) {
            LOGGER.error("Something went worng ", e);
        }

        String content = FileUtils.readFileToString(resultsFile);
        Feature feature = null;
        // check if the execution as results
        // to present the result in the interface
        if (!content.equals("")) {
            ReporterParser reporterParser = new ReporterParser();
            List<Feature> features = reporterParser.parseJsonResult(content);
            if (features != null && !features.isEmpty()) {
                feature = features.get(0);
                feature.processSteps();
            }
        }

        return feature;
    }

    public List<StepDefinitionDTO> getStepDefinitions() {
        return cucumberEngine.runWithContext(cucumberEngine.new RhinoCallable<List<StepDefinitionDTO>, RuntimeException>() {
            @Override
            protected List<StepDefinitionDTO> doCall(Context cx, Scriptable scope) throws RuntimeException {
                try {
                    ResourceLoader resourceLoader = new MultiLoader(Thread.currentThread().getContextClassLoader());
                    List<Backend> allBackends = getAllBackends(cx, scope, resourceLoader, projectCucumberProperties);

                    RuntimeBuilder runtimeBuilder = new RuntimeBuilder()
                        .withArgs(projectCucumberProperties.getOptions().toArgs())
                        .withResourceLoader(resourceLoader)
                        .withBackends(allBackends);
                    runtimeBuilder.build();
                    RuntimeOptions runtimeOptions = runtimeBuilder.getRuntimeOptions();

                    SimpleGlue glue = new SimpleGlue();
                    for (Backend backend : allBackends) {
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
        });
    }

    @Override
    public Object eval(Evaluation evaluation) {
        // TODO
        return super.eval(evaluation);
    }

    @Override
    public StackTraceElement[] getExecutionStackTrace() {
        if (cucumberEngine != null) {
            return cucumberEngine.getExecutionStackTrace();
        } else {
            return super.getExecutionStackTrace();
        }
    }

    @Override
    public boolean isRunning() {
        if (cucumberEngine != null) {
            return cucumberEngine.isRunning();
        }
        return super.isRunning();
    }

    @Override
    public void cancel() {
        if (cucumberEngine != null) {
            cucumberEngine.cancel();
        } else {
            super.cancel();
        }
    }

    public List<SnippetProperties> getSnippets() {
        return projectCucumberProperties.getSnippets();
    }

    protected List<RemoteBackend> getRemoteBackends(CucumberProperties cucumberProperties) {
        List<RemoteBackendProperties> remoteBackendProperties = cucumberProperties.getRemoteBackends();
        List<RemoteBackend> remoteBackends = Lists.newArrayList();
        for (RemoteBackendProperties props : remoteBackendProperties) {
            remoteBackends.add(props.createRemoteBackend());
        }
        return remoteBackends;
    }

    protected CucumberProperties createEvaluationCucumberProperties(File resultsFile, String featurePath) {
        OptionsProperties options = new OptionsProperties();
        options.setFeatures(ImmutableList.<String>of(featurePath));
        options.setPlugin(ImmutableList.of("json:" + resultsFile.getAbsolutePath()));
        options.setGlue(ImmutableList.of(new File(resourcesDir, "steps").getAbsolutePath()));
        CucumberProperties cucumberProperties = new CucumberProperties();
        cucumberProperties.setOptions(options);
        cucumberProperties.setRemoteBackends(projectCucumberProperties.getRemoteBackends());
        return cucumberProperties;
    }

    protected List<Throwable> run(final CucumberProperties cucumberProperties, final String sessionId) {
        cucumberEngine = createJsEngine();
        try {
            return cucumberEngine.runWithContext(cucumberEngine.new RhinoCallable<List<Throwable>, RuntimeException>() {
                @Override
                protected List<Throwable> doCall(Context cx, Scriptable scope) throws RuntimeException {
                    try {
                        CucumberLiveReporter cucumberLiveReporter = new CucumberLiveReporter(sessionId, messagingTemplate);

                        ResourceLoader resourceLoader = new MultiLoader(Thread.currentThread().getContextClassLoader());
                        List<Backend> allBackends = getAllBackends(cx, scope, resourceLoader, cucumberProperties);

                        RuntimeBuilder runtimeBuilder = new RuntimeBuilder()
                            .withArgs(cucumberProperties.getOptions().toArgs())
                            .withResourceLoader(resourceLoader)
                            .withPlugins(cucumberLiveReporter)
                            .withBackends(allBackends);
                        Runtime runtime = runtimeBuilder.build();
                        runtime.run();
                        return runtime.getErrors();
                    } catch (Exception e) {
                        throw Throwables.propagate(e);
                    }
                }
            });
        } finally {
            cucumberEngine = null;
        }
    }

    protected List<Backend> getAllBackends(Context cx, Scriptable scope, ResourceLoader resourceLoader, CucumberProperties cucumberProperties) throws IOException {
        MiniumBackend miniumBackend = new MiniumBackend(resourceLoader, cx, scope);
        List<RemoteBackend> remoteBackends = getRemoteBackends(cucumberProperties);
        List<Backend> allBackends = ImmutableList.<Backend>builder().add(miniumBackend).addAll(remoteBackends).build();
        return allBackends;
    }
}
