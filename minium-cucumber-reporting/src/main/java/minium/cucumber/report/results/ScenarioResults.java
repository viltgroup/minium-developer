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

public class ScenarioResults {

    private int numberOfTotalScenarios;
    private int numberOfScenariosPassed;
    private int numberOfScenariosFailed;

    public ScenarioResults(int numberOfTotalScenarios, int numberOfScenariosPassed, int numberOfScenariosFailed) {
        this.numberOfTotalScenarios = numberOfTotalScenarios;
        this.numberOfScenariosPassed = numberOfScenariosPassed;
        this.numberOfScenariosFailed = numberOfScenariosFailed;
    }

    public int getNumberOfScenariosPassed() {
        return numberOfScenariosPassed;
    }

    public int getNumberOfScenariosFailed() {
        return numberOfScenariosFailed;
    }

    public int getNumberOfTotalScenarios() {
        return numberOfTotalScenarios;
    }
}