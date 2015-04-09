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

import minium.cucumber.report.domain.Element;

public class ScenarioResults {

    // @JsonView(Views.Full.class)
    List<Element> passedScenarios;

    // @JsonView(Views.Full.class)
    List<Element> failedScenarios;

    public ScenarioResults(List<Element> passedScenarios, List<Element> failedScenarios) {
        this.passedScenarios = passedScenarios;
        this.failedScenarios = failedScenarios;
    }

    public int getNumberOfScenariosPassed() {
        return passedScenarios.size();
    }

    public int getNumberOfScenariosFailed() {
        return failedScenarios.size();
    }

}