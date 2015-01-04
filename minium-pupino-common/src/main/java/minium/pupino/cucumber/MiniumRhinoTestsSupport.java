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

import static com.google.common.base.Preconditions.checkNotNull;
import static com.google.common.base.Preconditions.checkState;
import static com.google.common.base.Throwables.propagate;

import java.io.IOException;
import java.io.InputStream;
import java.lang.reflect.Field;
import java.util.List;

import org.apache.commons.io.IOUtils;
import org.apache.commons.lang3.StringUtils;
import org.mozilla.javascript.Context;
import org.mozilla.javascript.Scriptable;
import org.mozilla.javascript.json.JsonParser;
import org.mozilla.javascript.json.JsonParser.ParseException;
import org.mozilla.javascript.tools.shell.Global;
import org.springframework.beans.factory.BeanFactory;
import org.springframework.core.io.DefaultResourceLoader;
import org.springframework.core.io.Resource;
import org.springframework.core.io.support.PathMatchingResourcePatternResolver;
import org.springframework.util.ReflectionUtils;
import org.springframework.util.ReflectionUtils.FieldCallback;

import com.google.common.base.Charsets;
import com.google.common.collect.Lists;
import com.vilt.minium.script.MiniumContextLoader;

public class MiniumRhinoTestsSupport {

    private ClassLoader classLoader;
    private Object testInstance;
    private BeanFactory beanFactory;
    private Context cx;
    private Scriptable scope;

    public MiniumRhinoTestsSupport(ClassLoader classLoader, Object testInstance, BeanFactory beanFactory, Context cx, Scriptable scope) {
        this.classLoader = classLoader;
        this.testInstance = testInstance;
        this.beanFactory = beanFactory;
        this.cx = cx;
        this.scope = scope;
    }

    public void initialize() throws IOException {
        if (scope instanceof Global) {
            ((Global) scope).installRequire(cx, getModulesUrls(), false);
        }
        new MiniumContextLoader(classLoader).load(cx, scope);
        populateScope();
    }

    protected Object populateScope() {
        try {
            // extract annotated fields and bind them to rhino scope
            ReflectionUtils.doWithFields(testInstance.getClass(), new FieldCallback() {

                @Override
                public void doWith(Field f) throws IllegalArgumentException, IllegalAccessException {
                    f.setAccessible(true);
                    JsVariable jsVariable = f.getAnnotation(JsVariable.class);
                    if (jsVariable == null) return;

                    String varName = jsVariable.value();
                    checkNotNull(varName, "@JsVariable.value() should not be null");
                    Object fieldVal = f.get(testInstance);
                    Object val = getVal(jsVariable, f.getType(), fieldVal);
                    put(scope, varName, val);

                    if (fieldVal == null && val != null) {
                        f.set(testInstance, val);
                    }
                }
            });

            return testInstance;
        } catch (RuntimeException e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    protected Object getVal(JsVariable jsVariable, Class<?> clazz, Object object) {
        try {
            Resource resource = getResource(jsVariable);

            if (resource != null) {
                if (clazz == String.class) {
                    InputStream is = resource.getInputStream();
                    try {
                        return IOUtils.toString(is, Charsets.UTF_8.name());
                    } finally {
                        IOUtils.closeQuietly(is);
                    }
                } else {
                    Object val = parseJson(cx, scope, resource);
                    checkState(clazz.isAssignableFrom(val.getClass()));
                    return val;
                }
            } else {
                return object;
            }
        } catch (IOException e) {
            throw propagate(e);
        } catch (ParseException e) {
            throw propagate(e);
        }
    }

    protected Resource getResource(JsVariable jsVariable) {
        String resourcePath = jsVariable.resource();
        Resource resource = null;
        if (StringUtils.isNotEmpty(resourcePath)) {
            resource = new DefaultResourceLoader(classLoader).getResource(resourcePath);
        } else if (StringUtils.isNotEmpty(jsVariable.resourceBean())) {
            resource = beanFactory.getBean(jsVariable.resourceBean(), Resource.class);
        }
        if (resource == null) return null;

        checkState(resource.exists() && resource.isReadable());
        return resource;
    }

    protected void put(Scriptable scope, String name, Object value) {
        scope.put(name, scope, Context.javaToJS(value, scope));
    }

    protected void delete(Scriptable scope, String name) {
        scope.delete(name);
    }

    protected Object parseJson(Context cx, Scriptable scope, Resource resource) throws ParseException, IOException {
        String json = IOUtils.toString(resource.getInputStream());
        return parseJson(cx, scope, json);
    }

    protected Object parseJson(Context cx, Scriptable scope, String json) throws ParseException {
        return new JsonParser(cx, scope).parseValue(json);
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
