/*
 * Copyright (C) 2015 The Minium Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package minium.cucumber.report;

import java.util.List;
import java.util.Objects;

import minium.cucumber.report.domain.Element;
import minium.cucumber.report.domain.Feature;
import minium.cucumber.report.domain.Status;
import minium.cucumber.report.domain.Step;
import minium.cucumber.report.domain.Views;

import com.fasterxml.jackson.annotation.JsonView;
import com.google.common.collect.Lists;

public class FeatureResult {

    @JsonView(Views.Full.class)
    private StepResults stepResults;

    @JsonView(Views.Full.class)
    private ScenarioResults scenarioResults;

    @JsonView(Views.Public.class)
    private Feature feature;

    @JsonView(Views.Public.class)
    private String profile;

    public FeatureResult() {
    }

    public FeatureResult(Feature feature) {
        this.setFeature(feature);
        this.processSteps();
    }

    public FeatureResult(Feature feature, String profile) {
        this.setFeature(feature);
        this.setProfile(profile);
        this.processSteps();
    }

    public int getNumberOfSteps() {
        return stepResults.getNumberOfSteps();
    }

    public int getNumberOfPasses() {
        return stepResults.getNumberOfPasses();
    }

    public int getNumberOfFailures() {
        return stepResults.getNumberOfFailures();
    }

    public int getNumberOfPending() {
        return stepResults.getNumberOfPending();
    }

    public int getNumberOfSkipped() {
        return stepResults.getNumberOfSkipped();
    }

    public int getNumberOfMissing() {
        return stepResults.getNumberOfMissing();
    }

    public int getNumberOfUndefined() {
        return stepResults.getNumberOfUndefined();
    }

    public long getDurationOfSteps() {
        return stepResults.getTotalDuration();
    }

    public int getNumberOfScenariosPassed() {
        return scenarioResults.getNumberOfScenariosPassed();
    }

    public int getNumberOfScenariosFailed() {
        return scenarioResults.getNumberOfScenariosFailed();
    }

    public int getNumberOfTotalScenarios() {
        return scenarioResults.getNumberOfTotalScenarios();
    }

    public Feature getFeature() {
        return feature;
    }

    public void setFeature(Feature feature) {
        this.feature = feature;
    }

    protected void processSteps() {
        List<Step> allSteps = Lists.newArrayList();
        List<Step> passedSteps = Lists.newArrayList();
        List<Step> failedSteps = Lists.newArrayList();
        List<Step> skippedSteps = Lists.newArrayList();
        List<Step> undefinedSteps = Lists.newArrayList();
        List<Step> pendingSteps = Lists.newArrayList();
        List<Step> missingSteps = Lists.newArrayList();
        List<Element> allScenarios = Lists.newArrayList();
        List<Element> passedScenarios = Lists.newArrayList();
        List<Element> failedScenarios = Lists.newArrayList();
        Long totalDuration = 0L;

        for (Element element : feature.getElements()) {
            calculateScenarioStats(allScenarios, passedScenarios, failedScenarios, element);
            for (Step step : element.getSteps()) {
                allSteps.add(step);
                switch (step.getStatus()) {
                case PASSED:
                    passedSteps.add(step);
                    break;
                case FAILED:
                    failedSteps.add(step);
                    break;
                case SKIPPED:
                    skippedSteps.add(step);
                    break;
                case UNDEFINED:
                    undefinedSteps.add(step);
                    break;
                case PENDING:
                    pendingSteps.add(step);
                    break;
                case MISSING:
                    missingSteps.add(step);
                    break;
                default:
                    break;
                }
                totalDuration = totalDuration + step.getDuration();
            }
        }

        scenarioResults = new ScenarioResults(allScenarios.size(), passedScenarios.size(), failedScenarios.size());
        stepResults = new StepResults(allSteps, passedSteps, failedSteps, skippedSteps, pendingSteps, missingSteps, undefinedSteps, totalDuration);
    }

    protected void calculateScenarioStats(List<Element> allScenarios, List<Element> passedScenarios, List<Element> failedScenarios, Element element) {
        if (Objects.equals(element.getType(), "scenario_outline")) return;
        
        if (!Objects.equals(element.getType(), "background")) {
            allScenarios.add(element);
            if (element.getStatus() == Status.PASSED) {
                passedScenarios.add(element);
            } else if (element.getStatus() == Status.FAILED) {
                failedScenarios.add(element);
            }
        }
    }

    public String getProfile() {
        return profile;
    }

    public void setProfile(String profile) {
        this.profile = profile;
    }
}
