package minium.pupino.config.webdriver;

import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.nullValue;
import static org.junit.Assert.assertThat;

import java.net.MalformedURLException;
import java.net.URL;

import minium.pupino.config.webdriver.WebElementsDriversProperties.DimensionProperties;
import minium.pupino.webdriver.SelectorGadgetWebElements;

import org.hamcrest.Matchers;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.openqa.selenium.Platform;
import org.openqa.selenium.remote.BrowserType;
import org.openqa.selenium.remote.CapabilityType;
import org.openqa.selenium.remote.DesiredCapabilities;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.SpringApplicationConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import com.google.common.collect.ImmutableMap;

@RunWith(SpringJUnit4ClassRunner.class)
@SpringApplicationConfiguration(classes = WebElementsDriversConfiguration.class)
public class WebElementsDriversConfigurationTest {

    @Autowired
    private WebElementsDriversProperties webElementsDriversProperties;

    @Test
    public void testWebElementsDriverProperties() throws MalformedURLException {
        DesiredCapabilities expectedDesiredCapabilities = new DesiredCapabilities(BrowserType.CHROME, "39.0", Platform.LINUX);
        DesiredCapabilities expectedRequiredCapabilities = new DesiredCapabilities(ImmutableMap.of(CapabilityType.PLATFORM, Platform.LINUX.name()));
        assertThat(new DesiredCapabilities(webElementsDriversProperties.getDesiredCapabilities()), equalTo(expectedDesiredCapabilities));
        assertThat(new DesiredCapabilities(webElementsDriversProperties.getRequiredCapabilities()), equalTo(expectedRequiredCapabilities));
        assertThat(webElementsDriversProperties.getElementInterfaces(), Matchers.<Class<?>>contains(SelectorGadgetWebElements.class));
        assertThat(webElementsDriversProperties.getUrl(), equalTo(new URL("http://localhost:4444/wd/hub")));
        assertThat(webElementsDriversProperties.getWindow().getSize(), equalTo(new DimensionProperties(1280, 1024)));
        assertThat(webElementsDriversProperties.getWindow().getPosition(), nullValue());
    }
}
