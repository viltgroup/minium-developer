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

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import com.fasterxml.jackson.annotation.JsonView;
import com.fasterxml.jackson.annotation.JsonInclude.Include;
import com.google.common.collect.Lists;

@JsonPropertyOrder({
        "comments",
        "examples",
        "line",
        "name",
        "description",
        "id",
        "after",
        "type",
        "keyword",
        "steps" })
public class Element {

    @JsonView(Views.Public.class)
    private Integer line;

    public Integer getLine() {
        return line;
    }

    @JsonView(Views.Public.class)
    private String name;

    @JsonView(Views.Public.class)
    private String description;

    @JsonView(Views.Public.class)
    private String keyword;

    @JsonView(Views.Public.class)
    private String type;

    @JsonView(Views.Public.class)
    private List<Step> steps = Lists.newArrayList();

    @JsonInclude(Include.NON_EMPTY)
    @JsonView(Views.Public.class)
    private List<Tag> tags = Lists.newArrayList();

    @JsonInclude(Include.NON_EMPTY)
    @JsonView(Views.Public.class)
    private List<Comment> comments = Lists.newArrayList();

    @JsonView(Views.Public.class)
    private List<Example> examples = Lists.newArrayList();

    @JsonInclude(Include.NON_EMPTY)
    @JsonView(Views.Public.class)
    private List<After> after = Lists.newArrayList();

    @JsonView(Views.Public.class)
    private String id;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public List<After> getAfter() {
        return after;
    }

    public void setAfter(List<After> after) {
        this.after = after;
    }

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

    public String getType() {
        return type;
    }

    public List<Step> getSteps() {
        return steps;
    }

    public List<Tag> getTags() {
        return tags;
    }

    public List<Comment> getComments() {
        return comments;
    }

    public void setComments(List<Comment> comments) {
        this.comments = comments;
    }

    @JsonIgnore
    public Status getStatus() {
        // can be optimized to retrieve only the count of elements and not the
        // all list
        for (Step step : steps) {
            if (step.getStatus() != Status.PASSED) {
                Status status = step.getStatus();
                return status;
            }
        }
        return Status.PASSED;
    }

    public List<Example> getExamples() {
        return examples;
    }

    public void setExamples(List<Example> examples) {
        this.examples = examples;
    }

}
