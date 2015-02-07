package minium.developer;

import minium.cucumber.config.ConfigProperties;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.bind.PropertiesConfigurationFactory;
import org.springframework.boot.env.YamlPropertySourceLoader;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.support.PropertySourcesPlaceholderConfigurer;
import org.springframework.core.env.MutablePropertySources;
import org.springframework.core.env.PropertySource;
import org.springframework.core.env.PropertySources;
import org.springframework.core.io.ClassPathResource;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(classes = NonDefaultConfigPropertiesReaderTest.class)
@Configuration
public class NonDefaultConfigPropertiesReaderTest {

    @Autowired
    private ConfigurableApplicationContext applicationContext;

    @Test
    public void testApplicationYml() throws Exception {
        YamlPropertySourceLoader loader = new YamlPropertySourceLoader();
        PropertySource<?> source = loader.load("ymltest", new ClassPathResource("test/application.yml"), null);
        MutablePropertySources propertySources = new MutablePropertySources();
        propertySources.addFirst(source);
        PropertySources appliedPropertySources = applyPlaceholderReplacements(propertySources);

        PropertiesConfigurationFactory<ConfigProperties> factory = new PropertiesConfigurationFactory<>(ConfigProperties.class);
        factory.setPropertySources(appliedPropertySources);
        factory.setTargetName("minium.config");
        factory.afterPropertiesSet();
        ConfigProperties configProperties = factory.getObject();
        System.out.println(configProperties.toJson());
    }

    private PropertySources applyPlaceholderReplacements(MutablePropertySources propertySources) {
        PropertySourcesPlaceholderConfigurer placeholderConfigurer = new PropertySourcesPlaceholderConfigurer();
        placeholderConfigurer.setPropertySources(propertySources);
        placeholderConfigurer.postProcessBeanFactory(applicationContext.getBeanFactory());
        PropertySources appliedPropertySources = placeholderConfigurer.getAppliedPropertySources();
        return appliedPropertySources;
    }
}
