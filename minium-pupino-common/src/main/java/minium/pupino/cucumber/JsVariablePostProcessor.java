package minium.pupino.cucumber;

import java.util.Map;
import java.util.Map.Entry;

import minium.pupino.config.ConfigProperties;
import minium.script.rhinojs.RhinoEngine;

import org.mozilla.javascript.Context;
import org.mozilla.javascript.Scriptable;
import org.mozilla.javascript.json.JsonParser;
import org.mozilla.javascript.json.JsonParser.ParseException;
import org.springframework.beans.BeansException;
import org.springframework.beans.factory.annotation.AnnotatedBeanDefinition;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.config.AutowireCapableBeanFactory;
import org.springframework.beans.factory.config.BeanDefinition;
import org.springframework.beans.factory.config.ConfigurableListableBeanFactory;
import org.springframework.beans.factory.support.BeanDefinitionRegistry;
import org.springframework.beans.factory.support.BeanDefinitionRegistryPostProcessor;
import org.springframework.context.ApplicationContext;
import org.springframework.core.type.MethodMetadata;
import org.springframework.util.MultiValueMap;

import com.google.common.base.Throwables;
import com.google.common.collect.Maps;

public class JsVariablePostProcessor implements BeanDefinitionRegistryPostProcessor {

    private Map<String, String> variableNames = Maps.newHashMap();

    @Autowired
    private ApplicationContext context;

    @Override
    public void postProcessBeanDefinitionRegistry(BeanDefinitionRegistry registry) throws BeansException {
        String[] beanDefinitionNames = registry.getBeanDefinitionNames();
        for (String beanDefinitionName : beanDefinitionNames) {
            BeanDefinition beanDefinition = registry.getBeanDefinition(beanDefinitionName);
            if (beanDefinition instanceof AnnotatedBeanDefinition) {
                MethodMetadata metadata = ((AnnotatedBeanDefinition) beanDefinition).getFactoryMethodMetadata();
                if (metadata == null) continue;
                MultiValueMap<String, Object> attrs = metadata.getAllAnnotationAttributes(JsVariable.class.getName());
                if (attrs == null) continue;
                String varName = (String) attrs.getFirst("value");
                variableNames.put(beanDefinitionName, varName == null ? beanDefinitionName : varName);
            }
        }
    }

    @Override
    public void postProcessBeanFactory(ConfigurableListableBeanFactory beanFactory) throws BeansException {
    }

    public void populateEngine(AutowireCapableBeanFactory beanFactory, RhinoEngine engine) {
        for (Entry<String, String> entry : variableNames.entrySet()) {
            String beanName = entry.getKey();
            String jsVar = entry.getValue();
            Object value = getVal(beanFactory, engine, beanName);
            put(engine, jsVar, value);
        }
    }

    protected Object getVal(AutowireCapableBeanFactory beanFactory, RhinoEngine engine, String beanName) {
        Object bean = beanFactory.getBean(beanName);
        if (bean == null) return null;
        return bean instanceof ConfigProperties ? parseJson(engine.getContext(), engine.getScope(), ((ConfigProperties) bean).toJson()) : bean;
    }

    protected void put(RhinoEngine engine, String name, Object value) {
        Scriptable scope = engine.getScope();
        scope.put(name, scope, Context.javaToJS(value, scope));
    }

    protected void delete(Scriptable scope, String name) {
        scope.delete(name);
    }

    protected Object parseJson(Context cx, Scriptable scope, String json) {
        try {
            return new JsonParser(cx, scope).parseValue(json);
        } catch (ParseException e) {
            throw Throwables.propagate(e);
        }
    }

}
