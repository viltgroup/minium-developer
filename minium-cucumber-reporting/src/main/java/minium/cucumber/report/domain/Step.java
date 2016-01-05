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

@JsonPropertyOrder({ "result", "embeddings", "line", "name", "match", "matchedColumns", "rows", "keyword" })
@JsonInclude(Include.NON_NULL)
public class Step {

    @JsonView(Views.Public.class)
    private String name;

    @JsonView(Views.Public.class)
    private String keyword;

    @JsonView(Views.Public.class)
    private Integer line;

    @JsonView(Views.Public.class)
    private Result result;

    @JsonInclude(Include.NON_EMPTY)
    @JsonView(Views.Public.class)
    private List<Row> rows = Lists.newArrayList();

    @JsonView(Views.Public.class)
    private Match match;
    
    @JsonInclude(Include.NON_EMPTY)
    @JsonView(Views.Public.class)
    private List<Integer> matchedColumns = Lists.newArrayList();

    @JsonInclude(Include.NON_EMPTY)
    @JsonView(Views.Public.class)
    private List<Embedding> embeddings = Lists.newArrayList();

    @JsonInclude(Include.NON_EMPTY)
    @JsonView(Views.Public.class)
    private List<String> output = Lists.newArrayList();

    @JsonView(Views.Public.class)
    private DocString docString;

    @JsonView(Views.Public.class)
    private String errorMessage;

    public Step() {
    }

    public String getKeyword() {
        return keyword;
    }

    public DocString getDocString() {
        return docString;
    }

    public List<Row> getRows() {
        return rows;
    }

    public List<String> getOutput() {
        return output;
    }

    public Match getMatch() {
        return match;
    }

    public List<Embedding> getEmbeddings() {
        return embeddings;
    }

    @JsonIgnore
    public Status getStatus() {
        return result == null ? Status.MISSING : result.getStatus();
    }

    @JsonIgnore
    public Long getDuration() {
        if (result == null) {
            return 1L;
        } else {
            return result.getDuration();
        }
    }

    public Result getResult() {
        return result;
    }

    public void setResult(Result result) {
        this.result = result;
    }

    public String getName() {
        return name;
    }

    public void setName(String newName) {
        this.name = newName;
    }

    public String getErrorMessage() {
        return errorMessage;
    }

    public void setErrorMessage(String errorMessage) {
        this.errorMessage = errorMessage;
    }

    public Integer getLine() {
        return line;
    }

    public void setLine(Integer line) {
        this.line = line;
    }

}
