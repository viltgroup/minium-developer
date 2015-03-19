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

import java.util.Map;

public class ConfigurationOptions {

    public static boolean skippedFailsBuildValue;
    public static boolean undefinedFailsBuildValue;
    public static boolean artifactsEnabledValue;
    public static Map<String, Artifact> artifactConfiguration;

    private ConfigurationOptions() {
        throw new AssertionError();
    }

    public static void setSkippedFailsBuild(boolean skippedFailsBuild) {
        skippedFailsBuildValue = skippedFailsBuild;
    }

    public static void setUndefinedFailsBuild(boolean undefinedFailsBuild) {
        undefinedFailsBuildValue = undefinedFailsBuild;
    }

    public static void setArtifactsEnabled(boolean artifactsEnabled) {
        artifactsEnabledValue = artifactsEnabled;
    }

    public static void setArtifactConfiguration(Map<String, Artifact> configuration) {
        artifactConfiguration = configuration;
    }

    public static boolean skippedFailsBuild() {
        return skippedFailsBuildValue;
    }

    public static boolean undefinedFailsBuild() {
        return undefinedFailsBuildValue;
    }

    public static boolean artifactsEnabled() {
        return artifactsEnabledValue;
    }

    public static Map<String, Artifact> artifactConfig() {
        return artifactConfiguration;
    }

}
