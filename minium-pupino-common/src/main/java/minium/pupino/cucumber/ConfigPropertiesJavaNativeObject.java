package minium.pupino.cucumber;

import java.io.Serializable;
import java.util.Map;

import minium.pupino.config.ConfigProperties;

import org.mozilla.javascript.Context;
import org.mozilla.javascript.Scriptable;
import org.mozilla.javascript.Wrapper;

public class ConfigPropertiesJavaNativeObject implements Scriptable, Wrapper, Serializable {

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