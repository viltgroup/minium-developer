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

import java.io.IOException;
import java.io.Serializable;
import java.lang.reflect.Field;
import java.util.List;
import java.util.Map;

import org.mozilla.javascript.Context;
import org.mozilla.javascript.Scriptable;
import org.mozilla.javascript.Wrapper;
import org.mozilla.javascript.tools.shell.Global;
import org.springframework.core.io.Resource;
import org.springframework.core.io.support.PathMatchingResourcePatternResolver;
import org.springframework.util.ReflectionUtils;
import org.springframework.util.ReflectionUtils.FieldCallback;

import com.google.common.collect.Lists;
import com.vilt.minium.script.MiniumContextLoader;

public class MiniumRhinoTestsSupport {

    public static class ConfigPropertiesJavaNativeObject implements Scriptable, Wrapper, Serializable {

        private static final long serialVersionUID = 898497710434802973L;

        private Scriptable parent;
        private Scriptable prototype;
        private Map<String, Object> javaObject;

        public ConfigPropertiesJavaNativeObject(Scriptable scope, Map<String, Object> obj) {
            parent = scope;
            this.javaObject = obj;
        }

        @Override
        public String getClassName() {
            return ConfigProperties.class.getSimpleName();
        }

        @SuppressWarnings("unchecked")
        @Override
        public Object get(String name, Scriptable start) {
            if ("length".equals(name)) return javaObject.size();
            Object props = javaObject.get(name);
            if (props == null) return null;
            if (props instanceof Map) return new ConfigPropertiesJavaNativeObject(this, (Map<String, Object>) props);
            Context cx  = Context.getCurrentContext();
            return cx.getWrapFactory().wrap(cx, this, props, props.getClass());
        }

        @Override
        public Object get(int index, Scriptable start) {
            return get(Integer.toString(index), start);
        }

        @Override
        public boolean has(String name, Scriptable start) {
            return javaObject.containsKey(name);
        }

        @Override
        public boolean has(int index, Scriptable start) {
            return javaObject.containsKey(Integer.toString(index));
        }

        @Override
        public void put(String name, Scriptable start, Object value) {
            // read only
        }

        @Override
        public void put(int index, Scriptable start, Object value) {
            // read only
        }

        @Override
        public void delete(String name) {
            // permanent
        }

        @Override
        public void delete(int index) {
            // permanent
        }

        @Override
        public Scriptable getPrototype() {
            return prototype;
        }

        @Override
        public void setPrototype(Scriptable prototype) {
            this.prototype = prototype;
        }

        @Override
        public Scriptable getParentScope() {
            return parent;
        }

        @Override
        public void setParentScope(Scriptable parent) {
            this.parent = parent;
        }

        @Override
        public Object[] getIds() {
            return javaObject.keySet().toArray();
        }

        @Override
        public Object getDefaultValue(Class<?> hint) {
            return new ConfigProperties();
        }

        @Override
        public boolean hasInstance(Scriptable instance) {
            // This is an instance of a Java class, so always return false
            return false;
        }

        @Override
        public Object unwrap() {
            return javaObject;
        }
    }

    private ClassLoader classLoader;
    private Object testInstance;
    private Context cx;
    private Scriptable scope;

    public MiniumRhinoTestsSupport(ClassLoader classLoader, Object testInstance, Context cx, Scriptable scope) {
        this.classLoader = classLoader;
        this.testInstance = testInstance;
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
                    f.set(testInstance, fieldVal);

                    if (fieldVal != null) {
                        fieldVal = getVal(jsVariable, f.getType(), fieldVal);
                    }
                    put(scope, varName, fieldVal);
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
        return clazz == ConfigProperties.class ? new ConfigPropertiesJavaNativeObject(scope, (ConfigProperties) object) : object;
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
