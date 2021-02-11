package minium.developer.project;

import static java.lang.String.format;

import java.io.File;
import java.io.IOException;
import java.net.URI;
import java.util.List;
import java.util.ListIterator;
import java.util.concurrent.CancellationException;

import com.google.common.base.Preconditions;
import org.apache.commons.io.FileUtils;
import org.junit.runner.notification.StoppedByUserException;
import org.mozilla.javascript.Context;
import org.mozilla.javascript.Scriptable;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.core.MessageSendingOperations;

import com.google.common.base.Joiner;
import com.google.common.collect.ImmutableList;
import com.google.common.collect.Lists;

import cucumber.runtime.Backend;
import cucumber.runtime.Runtime;
import cucumber.runtime.RuntimeOptions;
import cucumber.runtime.StepDefinition;
import cucumber.runtime.io.MultiLoader;
import cucumber.runtime.io.ResourceLoader;
import cucumber.runtime.model.CucumberBackground;
import cucumber.runtime.model.CucumberExamples;
import cucumber.runtime.model.CucumberFeature;
import cucumber.runtime.model.CucumberScenario;
import cucumber.runtime.model.CucumberScenarioOutline;
import cucumber.runtime.model.CucumberTagStatement;
import minium.cucumber.config.CucumberProperties;
import minium.cucumber.config.CucumberProperties.OptionsProperties;
import minium.cucumber.config.CucumberProperties.RemoteBackendProperties;
import minium.cucumber.config.CucumberProperties.SnippetProperties;
import minium.cucumber.data.MiniumRunTimeOptions;
import minium.cucumber.internal.ListenerReporter;
import minium.cucumber.internal.MiniumBackend;
import minium.cucumber.internal.RuntimeBuilder;
import minium.cucumber.report.FeatureResult;
import minium.cucumber.report.domain.Feature;
import minium.cucumber.rest.RemoteBackend;
import minium.cucumber.rest.SimpleGlue;
import minium.developer.cucumber.reports.ReporterParser;
import minium.developer.project.MavenDependencyProvider.MavenException;
import minium.developer.service.DeveloperStepListener;
import minium.developer.web.rest.LaunchInfo;
import minium.developer.web.rest.dto.StepDTO;
import minium.developer.web.rest.dto.StepDefinitionDTO;
import minium.internal.Throwables;
import minium.script.rhinojs.RhinoEngine;

public class CucumberProjectContext extends AbstractProjectContext {

    private static final Logger LOGGER = LoggerFactory.getLogger(CucumberProjectContext.class);

    @Autowired
    private MavenDependencyProvider dependencyProvider;

    @Autowired
    private MessageSendingOperations<String> messagingTemplate;

    private CucumberProperties projectCucumberProperties;
    private RhinoEngine cucumberEngine;

    public CucumberProjectContext(ProjectProperties projConfiguration) throws Exception {
        super(projConfiguration);
    }

    @Override
    protected void refreshConfiguration() throws Exception {
        super.refreshConfiguration();
        this.projectCucumberProperties = getAppConfigBean("minium.cucumber", CucumberProperties.class);
    }

    @Override
    protected void refreshAdditionalClasspath() throws MavenException, IOException {
        additionalClasspath = dependencyProvider.getDependencies(projectProperties.getDir());
    }

    public FeatureResult launchCucumber(LaunchInfo launchInfo, final String sessionId) throws Exception {
        refreshConfiguration();

        URI file = launchInfo.getFileProps().getRelativeUri();

        File featureFile = new File(projectProperties.getResourcesDir(), file.getPath());

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
            run(cucumberProperties, sessionId, launchInfo.getFileProps().getUri().toString(), launchInfo.getFileProps().getPreview());
        } catch (StoppedByUserException e) {
            LOGGER.debug("Stopped by user ", e);
        } catch (CancellationException e) {
            LOGGER.error("Something went worng ", e);
        }

        String content = FileUtils.readFileToString(resultsFile);
        FeatureResult featureResult = null;
        // check if the execution as results
        // to present the result in the interface
        if (!"".equals(content)) {
            ReporterParser reporterParser = new ReporterParser();
            List<Feature> features = reporterParser.parseJsonResult(content);
            if (features != null && !features.isEmpty()) {
                Feature feature = features.get(0);
                featureResult = new FeatureResult(feature);
            }
        }

        return featureResult;
    }

    public List<StepDefinitionDTO> getStepDefinitions() {
        return cucumberEngine.runWithContext(cucumberEngine.new RhinoCallable<List<StepDefinitionDTO>, RuntimeException>() {
            @Override
            protected List<StepDefinitionDTO> doCall(Context cx, Scriptable scope) throws RuntimeException {
                try {
                    ResourceLoader resourceLoader = new MultiLoader(Thread.currentThread().getContextClassLoader());
                    List<Backend> allBackends = getAllBackends(cx, scope, resourceLoader, projectCucumberProperties);

                    RuntimeBuilder runtimeBuilder = new RuntimeBuilder().withArgs(projectCucumberProperties.getOptions().toArgs())
                            .withResourceLoader(resourceLoader).withBackends(allBackends);
                    runtimeBuilder.build();
                    MiniumRunTimeOptions runtimeOptions = (MiniumRunTimeOptions) runtimeBuilder.getRuntimeOptions();

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
        options.setFeatures(ImmutableList.<String> of(featurePath));
        options.setPlugin(ImmutableList.of("json:" + resultsFile.getAbsolutePath()));
        options.setMonochrome(true);
        List<String> glues = Lists.newArrayList(projectCucumberProperties.getOptions().getGlue());
        for (ListIterator<String> iterator = glues.listIterator(); iterator.hasNext();) {
            String glue = iterator.next();
            if (glue.startsWith("src/test/resources/")) {
                iterator.set(new File(projectProperties.getResourcesDir(), glue.substring("src/test/resources/".length())).getAbsolutePath());
            }
        }
        options.setGlue(glues);
        CucumberProperties cucumberProperties = new CucumberProperties();
        cucumberProperties.setOptions(options);
        cucumberProperties.setRemoteBackends(projectCucumberProperties.getRemoteBackends());
        return cucumberProperties;
    }

    protected List<Throwable> run(final CucumberProperties cucumberProperties, final String sessionId, final String uri, final boolean isPreview) {
        cucumberEngine = createJsEngine();
        Preconditions.checkState(cucumberEngine != null, "No cucumber engine provided");
        try {
            return cucumberEngine.runWithContext(cucumberEngine.new RhinoCallable<List<Throwable>, RuntimeException>() {
                @Override
                protected List<Throwable> doCall(Context cx, Scriptable scope) throws RuntimeException {
                    try {
                        DeveloperStepListener cucumberLiveReporter = new DeveloperStepListener(messagingTemplate, sessionId, uri);

                        ResourceLoader resourceLoader = new MultiLoader(Thread.currentThread().getContextClassLoader());
                        List<Backend> allBackends = getAllBackends(cx, scope, resourceLoader, cucumberProperties);
                        MiniumRunTimeOptions miniumRuntimeOptions = null;
                        if (isPreview) {
                            miniumRuntimeOptions = new MiniumRunTimeOptions(cucumberProperties.getOptions().toArgs(), projectProperties.getResourcesDir());
                        }
                        try (ListenerReporter listenerReporter = new ListenerReporter()) {
                            listenerReporter.add(cucumberLiveReporter);
                            RuntimeBuilder runtimeBuilder = new RuntimeBuilder().withArgs(cucumberProperties.getOptions().toArgs())
                                    .withResourceLoader(resourceLoader).withPlugins(cucumberLiveReporter, listenerReporter).withBackends(allBackends)
                                    .withRuntimeOptions(miniumRuntimeOptions);

                            Runtime runtime = runtimeBuilder.build();
                            List<CucumberFeature> cucumberFeatures;

                            RuntimeOptions runtimeOptions = runtimeBuilder.getRuntimeOptions();
                            cucumberFeatures = runtimeOptions.cucumberFeatures(runtimeBuilder.getResourceLoader());

                            // send to the client the total number of test to
                            // execute
                            sendTotalSteps(cucumberFeatures, sessionId);

                            runtime.run();

                            // send snippets of undefined steps to the client
                            sendSnippets(runtime, sessionId);
                            return runtime.getErrors();
                        }
                    } catch (Exception e) {
                        throw Throwables.propagate(e);
                    }
                }

            });
        } finally {
            cucumberEngine = null;
        }
    }

    private void sendTotalSteps(List<CucumberFeature> cucumberFeatures, String sessionId) {
        int numberOfTestCases = 0;
        for (final CucumberFeature cucumberFeature : cucumberFeatures) {
            int numSteps = 0;
            for (final CucumberTagStatement cucumberTagStatement : cucumberFeature.getFeatureElements()) {
                if (cucumberTagStatement instanceof CucumberScenario) {
                    CucumberBackground cucumberBackground = ((CucumberScenario) cucumberTagStatement).getCucumberBackground();
                    numberOfTestCases += cucumberTagStatement.getSteps().size();
                    numberOfTestCases += cucumberBackground == null ? 0 : cucumberBackground.getSteps().size();
                } else if (cucumberTagStatement instanceof CucumberScenarioOutline) {
                    for (final CucumberExamples cucumberExamples : ((CucumberScenarioOutline) cucumberTagStatement).getCucumberExamplesList()) {
                        for (final CucumberScenario cucumberScenario : cucumberExamples.createExampleScenarios()) {
                            CucumberBackground cucumberBackground = cucumberScenario.getCucumberBackground();
                            numSteps += cucumberScenario.getSteps().size();
                            numSteps += cucumberBackground == null ? 0 : cucumberBackground.getSteps().size();
                        }
                    }
                    numberOfTestCases = numSteps;
                }
            }
        }
        messagingTemplate.convertAndSend("/tests/" + sessionId, numberOfTestCases);
    }

    protected List<Backend> getAllBackends(Context cx, Scriptable scope, ResourceLoader resourceLoader, CucumberProperties cucumberProperties)
            throws IOException {
        MiniumBackend miniumBackend = new MiniumBackend(resourceLoader, cx, scope);
        List<RemoteBackend> remoteBackends = getRemoteBackends(cucumberProperties);
        return ImmutableList.<Backend> builder().add(miniumBackend).addAll(remoteBackends).build();
    }

    protected void sendSnippets(Runtime runtime, String sessionId) {
        List<String> snippets = runtime.getSnippets();
        if (!(snippets.isEmpty())) {
            for (String snippet : snippets) {
                StepDTO stepDTO = new StepDTO(snippet, 0, "", "snippet");
                messagingTemplate.convertAndSend("/cucumber/" + sessionId, stepDTO);
            }
        }
    }
}
