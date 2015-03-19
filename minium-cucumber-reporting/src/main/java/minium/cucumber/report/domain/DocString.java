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

/**
 * Doc Strings are handy for specifying a larger piece of text. This is inspired from Python’s Docstring syntax.
 *
 * In your step definition, there’s no need to find this text and match it in your Regexp. It will automatically be passed as the last parameter in the step definition.
 */
public class DocString {

    /**
     * The contents of the docstring
     */
    private String value;

    private String contentType;

    /**
     * Line on which docstring occurs
     */
    private Integer line;

    public DocString() {
        // no arg constructor required for gson
    }

    public String getValue() {
        return value;
    }

    public String getContentType() {
        return contentType;
    }

    public Integer getLine() {
        return line;
    }
}
