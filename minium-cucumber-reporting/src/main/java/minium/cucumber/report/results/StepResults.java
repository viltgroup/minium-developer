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
package minium.cucumber.report.results;

import java.util.List;

import minium.cucumber.report.domain.Step;

public class StepResults {

    List<Step> allSteps;
    List<Step> passedSteps;
    List<Step> failedSteps;
    List<Step> skippedSteps;
    List<Step> undefinedSteps;
    List<Step> pendingSteps;
    List<Step> missingSteps;
    Long totalDuration;

    public StepResults(List<Step> allSteps, List<Step> passedSteps, List<Step> failedSteps, List<Step> skippedSteps, List<Step> pendingSteps, List<Step> missingSteps, List<Step> undefinedSteps, Long totalDuration) {
        this.allSteps = allSteps;
        this.passedSteps = passedSteps;
        this.failedSteps = failedSteps;
        this.skippedSteps = skippedSteps;
        this.undefinedSteps = undefinedSteps;
        this.pendingSteps = pendingSteps;
        this.missingSteps = missingSteps;
        this.totalDuration = totalDuration;
    }

    public int getNumberOfSteps() {
        return allSteps.size();
    }

    public int getNumberOfPasses() {
        return passedSteps.size();
    }

    public int getNumberOfFailures() {
        return failedSteps.size();
    }

    public int getNumberOfUndefined() {
        return undefinedSteps.size();
    }

    public int getNumberOfPending() {
        return pendingSteps.size();
    }

    public int getNumberOfSkipped() {
        return skippedSteps.size();
    }

    public int getNumberOfMissing() {
        return missingSteps.size();
    }

    public long getTotalDuration() {
        return totalDuration;
    }
}