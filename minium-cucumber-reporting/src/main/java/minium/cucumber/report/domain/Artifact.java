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
package minium.cucumber.report.domain;

public class Artifact {

    private String scenario;
    private String step;
    private String keyword;
    private String artifactFile;
    private String contentType;

    public Artifact(String scenario, String step, String keyword, String artifactFile, String contentType) {
        this.scenario = scenario;
        this.step = step;
        this.keyword = keyword;
        this.artifactFile = artifactFile;
        this.contentType = contentType;
    }

    public String getScenario() {
        return scenario;
    }

    public String getKeyword() {
        return keyword;
    }

    public String getStep() {
           return step;
       }

    public String getArtifactFile() {
        return artifactFile;
    }

    public String getContentType() {
        return contentType;
    }
}
