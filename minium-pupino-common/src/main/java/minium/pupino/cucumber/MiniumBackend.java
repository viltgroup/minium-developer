/*
 * Copyright (C) 2013 The Minium Authors
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
package minium.pupino.cucumber;

import gherkin.formatter.model.Step;

import java.io.IOException;
import java.io.InputStreamReader;
import java.util.List;

import org.mozilla.javascript.Context;
import org.mozilla.javascript.Function;
import org.mozilla.javascript.NativeFunction;
import org.mozilla.javascript.ScriptableObject;
import org.mozilla.javascript.regexp.NativeRegExp;
import org.mozilla.javascript.tools.shell.Global;

import com.google.common.base.Charsets;
import com.google.common.base.Throwables;

import cucumber.runtime.Backend;
import cucumber.runtime.CucumberException;
import cucumber.runtime.Glue;
import cucumber.runtime.UnreportedStepExecutor;
import cucumber.runtime.io.Resource;
import cucumber.runtime.io.ResourceLoader;
import cucumber.runtime.rhino.JavaScriptSnippet;
import cucumber.runtime.rhino.RhinoHookDefinition;
import cucumber.runtime.rhino.RhinoStepDefinition;
import cucumber.runtime.snippets.FunctionNameGenerator;
import cucumber.runtime.snippets.SnippetGenerator;

public class MiniumBackend implements Backend {

    private static final String JS_DSL = "/cucumber/runtime/rhino/dsl.js";
    private final SnippetGenerator snippetGenerator = new SnippetGenerator(new JavaScriptSnippet());
    private final ResourceLoader resourceLoader;
    private Glue glue;
    private Context cx;
    private ScriptableObject scope;

    public MiniumBackend(ResourceLoader resourceLoader, Context cx, ScriptableObject scope) throws IOException {
        try {
            this.resourceLoader = resourceLoader;
            this.cx = cx;
            this.scope = scope;
            this.scope.put("jsBackend", this.scope, this);
            InputStreamReader dsl = new InputStreamReader(getClass().getResourceAsStream(JS_DSL), Charsets.UTF_8.toString());
            this.cx.evaluateReader(this.scope, dsl, JS_DSL, 1, null);
        } catch (Exception e) {
            throw Throwables.propagate(e);
        }
    }

    @Override
    public void loadGlue(Glue glue, List<String> gluePaths) {
        this.glue = glue;
        for (String gluePath : gluePaths) {
            for (Resource resource : resourceLoader.resources(gluePath, ".js")) {
                try {
                    cx.evaluateReader(scope, new InputStreamReader(resource.getInputStream(), "UTF-8"), resource.getPath(), 1, null);
                } catch (IOException e) {
                    throw new CucumberException("Failed to evaluate Javascript in " + resource.getPath(), e);
                }
            }
        }
    }

    @Override
    public void setUnreportedStepExecutor(UnreportedStepExecutor executor) {
        // Not used yet
    }

    @Override
    public void buildWorld() {
    }

    @Override
    public void disposeWorld() {
    }

    @Override
    public String getSnippet(Step step, FunctionNameGenerator functionNameGenerator) {
        return snippetGenerator.getSnippet(step, functionNameGenerator);
    }

    private StackTraceElement jsLocation() {
        Throwable t = new Throwable();
        StackTraceElement[] stackTraceElements = t.getStackTrace();
        for (StackTraceElement stackTraceElement : stackTraceElements) {
            String fileName = stackTraceElement.getFileName();
            boolean js = fileName == null ? false : fileName.endsWith(".js");
            if (js) {
                boolean isDsl = fileName.endsWith(JS_DSL);
                boolean hasLine = stackTraceElement.getLineNumber() != -1;
                if (!isDsl && hasLine) {
                    return stackTraceElement;
                }
            }
        }
        throw new RuntimeException("Couldn't find location for step definition");
    }

    public void addStepDefinition(Global jsStepDefinition, NativeRegExp regexp, NativeFunction bodyFunc, NativeFunction argumentsFromFunc) throws Throwable {
        StackTraceElement stepDefLocation = jsLocation();
        RhinoStepDefinition stepDefinition = new RhinoStepDefinition(cx, scope, jsStepDefinition, regexp, bodyFunc, stepDefLocation, argumentsFromFunc);
        glue.addStepDefinition(stepDefinition);
    }

    public void addBeforeHook(Function fn, String[] tags, int order, long timeoutMillis) {
        StackTraceElement stepDefLocation = jsLocation();
        RhinoHookDefinition hookDefinition = new RhinoHookDefinition(cx, scope, fn, tags, order, timeoutMillis, stepDefLocation);
        glue.addBeforeHook(hookDefinition);
    }

    public void addAfterHook(Function fn, String[] tags, int order, long timeoutMillis) {
        StackTraceElement stepDefLocation = jsLocation();
        RhinoHookDefinition hookDefinition = new RhinoHookDefinition(cx, scope, fn, tags, order, timeoutMillis, stepDefLocation);
        glue.addAfterHook(hookDefinition);
    }
}
