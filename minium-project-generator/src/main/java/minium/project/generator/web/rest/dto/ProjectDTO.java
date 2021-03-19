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
package minium.project.generator.web.rest.dto;

public class ProjectDTO {

    private String directory;
    private String type;
    private String name;
    private String groupId = "com.minium.tests";
    private String artifactId;
    private String version;
    private String featureFile;
    private String stepFile;

    public ProjectDTO() {
        super();
    }

    public ProjectDTO(String directory, String type, String name, String groupId, String artifactId, String version, String featureFile, String stepFile) {
        super();
        this.directory = directory;
        this.type = type;
        this.name = name;
        this.groupId = groupId;
        this.artifactId = artifactId;
        this.version = version;
        this.featureFile = featureFile;
        this.stepFile = stepFile;
    }

    public String getDirectory() {
        return directory;
    }

    public void setDirectory(String directory) {
        this.directory = directory;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getGroupId() {
        return groupId;
    }

    public void setGroupId(String groupId) {
        this.groupId = groupId;
    }

    public String getArtifactId() {
        return artifactId;
    }

    public void setArtifactId(String artifactId) {
        this.artifactId = artifactId;
    }

    public String getVersion() {
        return version;
    }

    public void setVersion(String version) {
        this.version = version;
    }

    public String getFeatureFile() {
        return featureFile != null ? featureFile : (type.equals("monitoring") ? "performance" : "search");
    }

    public void setFeatureFile(String featureFile) {
        this.featureFile = featureFile;
    }

    public String getStepFile() {
        return stepFile != null ? featureFile : (type.equals("monitoring") ? "performance" : "search") + "-steps";
    }

    public void setStepFile(String stepFile) {
        this.stepFile = stepFile;
    }
}
