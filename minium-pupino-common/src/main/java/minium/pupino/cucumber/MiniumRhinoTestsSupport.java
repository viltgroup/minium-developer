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

import java.io.IOException;
import java.util.List;
import java.util.Map.Entry;

import minium.pupino.config.ConfigProperties;

import org.mozilla.javascript.Context;
import org.mozilla.javascript.Scriptable;
import org.mozilla.javascript.tools.shell.Global;
import org.springframework.beans.factory.config.AutowireCapableBeanFactory;
import org.springframework.core.io.Resource;
import org.springframework.core.io.support.PathMatchingResourcePatternResolver;

import com.google.common.collect.Lists;
import com.vilt.minium.script.MiniumContextLoader;

public class MiniumRhinoTestsSupport {

    private ClassLoader classLoader;
    private Context cx;
    private Scriptable scope;
    private JsVariablePostProcessor variablePostProcessor;
    private AutowireCapableBeanFactory beanFactory;

    public MiniumRhinoTestsSupport(ClassLoader classLoader, Context cx, Scriptable scope, AutowireCapableBeanFactory beanFactory, JsVariablePostProcessor variablePostProcessor) {
        this.classLoader = classLoader;
        this.cx = cx;
        this.scope = scope;
        this.beanFactory = beanFactory;
        this.variablePostProcessor = variablePostProcessor;
    }

    public void initialize() throws IOException {
        if (scope instanceof Global) {
            ((Global) scope).installRequire(cx, getModulesUrls(), false);
        }
        new MiniumContextLoader(classLoader).load(cx, scope);
        populateScope();
    }

    protected void populateScope() {
        for (Entry<String, String> entry : variablePostProcessor.getVariableNames().entrySet()) {
            String beanName = entry.getKey();
            String jsVar = entry.getValue();
            Object value = getVal(beanName);
            put(scope, jsVar, value);
        }
    }

    protected Object getVal(String beanName) {
        Object bean = beanFactory.getBean(beanName);
        if (bean == null) return null;
        return bean instanceof ConfigProperties ? new ConfigPropertiesJavaNativeObject(scope, (ConfigProperties) bean) : bean;
    }

    protected void put(Scriptable scope, String name, Object value) {
        scope.put(name, scope, Context.javaToJS(value, scope));
    }

    protected void delete(Scriptable scope, String name) {
        scope.delete(name);
    }

    protected List<String> getModulesUrls() throws IOException {
        PathMatchingResourcePatternResolver resolver = new PathMatchingResourcePatternResolver(classLoader);
        Resource[] resources = resolver.getResources("classpath*:modules");
        List<String> moduleUrls = Lists.newArrayList();
        for (Resource resource : resources) {
            moduleUrls.add(resource.getURL().toExternalForm());
        }
        return moduleUrls;
    }
}
