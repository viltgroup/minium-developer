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

import java.util.ArrayList;
import java.util.List;

import com.google.common.collect.Lists;

public class Feature {

    private String id;
    private String name;
    private String uri;
    private String description;
    private String keyword;
    private List<Element> elements = Lists.newArrayList();
    private List<Tag> tags = Lists.newArrayList();
    private String jsonFile = "";
    private Integer line;

    public Feature() {
    }

    public String getId() {
        return id;
    }

    public String getKeyword() {
        return keyword;
    }

    public String getJsonFile() {
        return jsonFile;
    }

    public void setJsonFile(String json) {
        this.jsonFile = json;
    }

    public List<Element> getElements() {
        return elements;
    }

    public String getUri() {
        return this.uri;
    }

    public List<Tag> getTags() {
        return tags;
    }

    public Integer getLine() {
        return line;
    }

    // public Util.Status getStatus() {
    // Sequence<Util.Status> results =
    // getElements().map(Element.functions.status());
    // return results.contains(Util.Status.FAILED) ? Util.Status.FAILED :
    // Util.Status.PASSED;
    // }

    public String getName() {
        return name;
    }

    public String getDescription() {
        return description;
    }

    public int getNumberOfScenarios() {
        List<Element> elementList = new ArrayList<Element>();
        for (Element element : elements) {
            if (!element.getKeyword().equals("Background")) {
                elementList.add(element);
            }
        }
        return elementList.size();
    }
}
