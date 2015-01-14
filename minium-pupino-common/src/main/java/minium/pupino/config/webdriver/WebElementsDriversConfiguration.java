package minium.pupino.config.webdriver;

import static java.lang.String.format;

import java.util.Set;

import minium.pupino.config.PupinoConfiguration;
import minium.pupino.config.webdriver.WebElementsDriversProperties.DimensionProperties;
import minium.pupino.config.webdriver.WebElementsDriversProperties.PointProperties;
import minium.pupino.config.webdriver.WebElementsDriversProperties.WindowProperties;
import minium.pupino.cucumber.JsVariable;
import minium.pupino.cucumber.JsVariablePostProcessor;
import minium.pupino.webdriver.SelectorGadgetWebElements;

import org.apache.commons.lang3.StringUtils;
import org.openqa.selenium.Dimension;
import org.openqa.selenium.Point;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.firefox.FirefoxDriver;
import org.openqa.selenium.ie.InternetExplorerDriver;
import org.openqa.selenium.phantomjs.PhantomJSDriver;
import org.openqa.selenium.remote.Augmenter;
import org.openqa.selenium.remote.BrowserType;
import org.openqa.selenium.remote.DesiredCapabilities;
import org.openqa.selenium.remote.LocalFileDetector;
import org.openqa.selenium.remote.RemoteWebDriver;
import org.openqa.selenium.safari.SafariDriver;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Lazy;
import org.springframework.core.env.Environment;

import com.google.common.collect.ImmutableSet;
import com.google.common.collect.Sets;
import com.vilt.minium.DefaultWebElementsDriver;
import com.vilt.minium.debug.DebugWebElements;

@Configuration
@EnableConfigurationProperties(WebElementsDriversProperties.class)
public class WebElementsDriversConfiguration {

    enum WebDriverType {
        CHROME(BrowserType.CHROME, BrowserType.GOOGLECHROME) {
            @Override
            public WebDriver create(DesiredCapabilities desiredCapabilities, DesiredCapabilities requiredCapabilities) {
                return new ChromeDriver(desiredCapabilities);
            }
        },
        FIREFOX(BrowserType.FIREFOX) {
            @Override
            public WebDriver create(DesiredCapabilities desiredCapabilities, DesiredCapabilities requiredCapabilities) {
                return new FirefoxDriver(desiredCapabilities);
            }
        },
        IE(BrowserType.IE, BrowserType.IEXPLORE) {
            @Override
            public WebDriver create(DesiredCapabilities desiredCapabilities, DesiredCapabilities requiredCapabilities) {
                return new InternetExplorerDriver(desiredCapabilities);
            }
        },
        SAFARI(BrowserType.SAFARI) {
            @Override
            public WebDriver create(DesiredCapabilities desiredCapabilities, DesiredCapabilities requiredCapabilities) {
                return new SafariDriver(desiredCapabilities);
            }
        },
        PHANTOMJS(BrowserType.PHANTOMJS) {
            @Override
            public WebDriver create(DesiredCapabilities desiredCapabilities, DesiredCapabilities requiredCapabilities) {
                return new PhantomJSDriver(desiredCapabilities);
            }
        };

        private Set<String> types;

        private WebDriverType(String ... types) {
            this.types = Sets.newHashSet();
            for (String type : types) {
                this.types.add(type.toLowerCase());
            }
        }

        public abstract WebDriver create(DesiredCapabilities desiredCapabilities, DesiredCapabilities requiredCapabilities);

        public static WebDriverType typeFor(String value) {
            value = value.toLowerCase();
            for (WebDriverType type : WebDriverType.values()) {
                if (type.types.contains(value)) return type;
            }
            throw new IllegalArgumentException(format("Type %s is not valid", value));
        }
    }

    @Bean
    public JsVariablePostProcessor jsVariablePostProcessor() {
        return new JsVariablePostProcessor();
    }

    @Autowired
    @Bean(destroyMethod = "quit")
    @Lazy
    @JsVariable("wd")
    public DefaultWebElementsDriver wd(WebElementsDriversProperties webElementsDriversProperties, Environment env) {
        DesiredCapabilities desiredCapabilities = new DesiredCapabilities(webElementsDriversProperties.getDesiredCapabilities());
        DesiredCapabilities requiredCapabilities = new DesiredCapabilities(webElementsDriversProperties.getRequiredCapabilities());
        WebDriver webDriver = null;
        if (webElementsDriversProperties.getUrl() != null) {
            RemoteWebDriver remoteDriver = new RemoteWebDriver(webElementsDriversProperties.getUrl(), desiredCapabilities, requiredCapabilities);
            remoteDriver.setFileDetector(new LocalFileDetector());
            webDriver = remoteDriver;
        } else {
            String browserName = desiredCapabilities == null ? null : desiredCapabilities.getBrowserName();
            if (StringUtils.isEmpty(browserName)) browserName = BrowserType.CHROME;
            webDriver = WebDriverType.typeFor(browserName).create(desiredCapabilities, requiredCapabilities);
        }
        WindowProperties window = webElementsDriversProperties.getWindow();
        if (window != null) {
            DimensionProperties size = window.getSize();
            PointProperties position = window.getPosition();
            if (size != null) webDriver.manage().window().setSize(new Dimension(size.getWidth(), size.getHeight()));
            if (position != null) webDriver.manage().window().setPosition(new Point(position.getX(), position.getY()));
            if (window.isMaximized()) {
                webDriver.manage().window().maximize();
            }
        }
        webDriver = new Augmenter().augment(webDriver);
        return new DefaultWebElementsDriver(webDriver, elementInterfaces(webElementsDriversProperties, env));
    }

    private Class<?>[] elementInterfaces(WebElementsDriversProperties webElementsDriversProperties, Environment env) {
        Set<Class<?>> elementInterfaces = ImmutableSet.<Class<?>>builder()
                .addAll(webElementsDriversProperties.getElementInterfaces())
                .add(env.acceptsProfiles(PupinoConfiguration.PUPINO_PROFILE) ?
                        new Class<?>[] { DebugWebElements.class, SelectorGadgetWebElements.class } :
                        new Class<?>[] {})
                .build();
        return elementInterfaces.toArray(new Class<?>[elementInterfaces.size()]);
    }

}
