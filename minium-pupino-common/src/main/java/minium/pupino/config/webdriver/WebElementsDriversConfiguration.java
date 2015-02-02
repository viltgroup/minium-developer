package minium.pupino.config.webdriver;

import static java.lang.String.format;
import static minium.script.rhinojs.RhinoWebModules.rhinoModule;
import static minium.web.WebModules.baseModule;
import static minium.web.WebModules.combine;
import static minium.web.WebModules.conditionalModule;
import static minium.web.WebModules.debugModule;
import static minium.web.WebModules.interactableModule;
import static minium.web.WebModules.positionModule;

import java.io.IOException;
import java.util.Set;

import minium.Elements;
import minium.Minium;
import minium.pupino.config.webdriver.WebElementsDriversProperties.DimensionProperties;
import minium.pupino.config.webdriver.WebElementsDriversProperties.PointProperties;
import minium.pupino.config.webdriver.WebElementsDriversProperties.WindowProperties;
import minium.pupino.cucumber.JsVariable;
import minium.pupino.webdriver.SelectorGadgetWebElements;
import minium.script.rhinojs.RhinoEngine;
import minium.script.rhinojs.RhinoProperties;
import minium.web.CoreWebElements.DefaultWebElements;
import minium.web.WebElementsFactory;
import minium.web.WebElementsFactory.Builder;
import minium.web.WebModule;
import minium.web.internal.actions.WebDebugInteractionPerformer;

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
import org.springframework.context.annotation.Profile;
import org.springframework.core.env.Environment;

import com.google.common.base.Strings;
import com.google.common.collect.Sets;

@Profile("!visual")
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

    @Autowired
    @Bean(destroyMethod = "quit")
    @JsVariable("wd")
    public WebDriver wd(WebElementsDriversProperties webElementsDriversProperties, Environment env) {
        DesiredCapabilities desiredCapabilities = new DesiredCapabilities(webElementsDriversProperties.getDesiredCapabilities());
        DesiredCapabilities requiredCapabilities = new DesiredCapabilities(webElementsDriversProperties.getRequiredCapabilities());
        WebDriver webDriver = null;
        if (webElementsDriversProperties.getUrl() != null) {
            RemoteWebDriver remoteDriver = new RemoteWebDriver(webElementsDriversProperties.getUrl(), desiredCapabilities, requiredCapabilities);
            remoteDriver.setFileDetector(new LocalFileDetector());
            webDriver = remoteDriver;
        } else {
            String browserName = desiredCapabilities == null ? null : desiredCapabilities.getBrowserName();
            if (Strings.isNullOrEmpty(browserName)) browserName = BrowserType.CHROME;
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
        return new Augmenter().augment(webDriver);
    }

    @Autowired
    @Bean
    public Elements root(WebDriver wd) {
        WebDebugInteractionPerformer performer = new WebDebugInteractionPerformer();
        WebModule webModule = combine(baseModule(wd), positionModule(), conditionalModule(), interactableModule(performer), debugModule(performer), rhinoModule(), new SelectorGadgetWebElements.SelectorGadgetWebModule());
        Builder<DefaultWebElements> builder = new WebElementsFactory.Builder<>();
        webModule.configure(builder);
        DefaultWebElements root = builder.build().createRoot();
        Minium.set(root);
        return root;
    }

    @Autowired
    @Bean
    public RhinoEngine rhinoEngine(RhinoProperties rhinoProperties, WebDriver wd) throws IOException {
        RhinoEngine rhinoEngine = new RhinoEngine(rhinoProperties);
        rhinoEngine.put("wd", wd);
        return rhinoEngine;
    }
}
