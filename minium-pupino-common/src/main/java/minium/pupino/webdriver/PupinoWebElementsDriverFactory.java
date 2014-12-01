package minium.pupino.webdriver;

import java.net.MalformedURLException;
import java.net.URL;

import org.apache.commons.lang3.StringUtils;
import org.openqa.selenium.Dimension;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.remote.Augmenter;
import org.openqa.selenium.remote.BrowserType;
import org.openqa.selenium.remote.DesiredCapabilities;
import org.openqa.selenium.remote.RemoteWebDriver;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import com.google.common.base.Strings;
import com.google.common.base.Throwables;
import com.vilt.minium.DefaultWebElementsDriver;
import com.vilt.minium.WebElements;
import com.vilt.minium.debug.DebugWebElements;
import com.vilt.minium.tips.TipWebElements;

@Component
@ConfigurationProperties(prefix = "webElementsDriverFactory", locations = "classpath:pupino.yml", ignoreUnknownFields = false)
public class PupinoWebElementsDriverFactory {

    @SuppressWarnings("unchecked")
    private static final Class<? extends WebElements>[] WEB_ELEMS_INTFS = (Class<? extends WebElements>[]) new Class<?>[] {
        DebugWebElements.class,
        TipWebElements.class,
        SelectorGadgetWebElements.class
    };

    private String url;
    private String browser;
    public Integer width;
    public Integer height;

    public void setUrl(String url) {
        this.url = url;
    }

    public void setBrowser(String browser) {
        this.browser = browser;
    }

    public void setWidth(Integer width) {
        this.width = width;
    }

    public void setHeight(Integer height) {
        this.height = height;
    }

    public DefaultWebElementsDriver create() {
        try {
            WebDriver webDriver = null;
            if (Strings.isNullOrEmpty(url)) {
                webDriver = new ChromeDriver();
            } else {
                DesiredCapabilities capabilities = DesiredCapabilities.chrome();
                if (StringUtils.equalsIgnoreCase(browser, BrowserType.FIREFOX)) {
                    capabilities = DesiredCapabilities.firefox();
                } else if (StringUtils.equalsIgnoreCase(browser, BrowserType.IE)) {
                    capabilities = DesiredCapabilities.internetExplorer();
                }
                webDriver = new RemoteWebDriver(new URL(url), capabilities);
                webDriver = new Augmenter().augment(webDriver);
            }
            if (width != null && height != null) {
                webDriver.manage().window().setSize(new Dimension(1920, 1080));
            }
//            webDriver = new StatefulWebDriver(webDriver);
            return new DefaultWebElementsDriver(webDriver, WEB_ELEMS_INTFS);
        } catch (MalformedURLException e) {
            throw Throwables.propagate(e);
        }
    }
}
