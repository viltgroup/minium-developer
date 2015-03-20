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

import java.util.List;

import com.google.common.collect.Lists;

public class Element {

    private String name;
    private String description;
    private String keyword;
    private List<Step> steps = Lists.newArrayList();
    private List<Tag> tags = Lists.newArrayList();

    public Element() {
    }

    public String getName() {
        return name;
    }

    public String getDescription() {
        return description;
    }

    public String getKeyword() {
        return keyword;
    }

    public List<Step> getSteps() {
        return steps;
    }

    public List<Tag> getTags() {
        return tags;
    }

    public Status getStatus() {
        // can be optimized to retrieve only the count of elements and not the
        // all list
        for (Step step : steps) {
            if (step.getStatus() == Status.FAILED)
                return Status.FAILED;
            if (ConfigurationOptions.skippedFailsBuild() && step.getStatus() == Status.SKIPPED)
                return Status.FAILED;
            if (ConfigurationOptions.undefinedFailsBuild() && step.getStatus() == Status.UNDEFINED)
                return Status.FAILED;
        }
        return Status.PASSED;
    }

}
