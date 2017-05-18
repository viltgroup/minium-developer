package minium.developer.service;

import java.io.IOException;
import java.util.List;
import java.util.Map;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;

import com.google.common.collect.Maps;

import minium.developer.config.WebDriversProperties;
import minium.developer.config.WebDriversProperties.DeveloperWebDriverProperties;
import minium.developer.config.WebDriversProperties.RecorderProperties;
import minium.developer.webdriver.ChromeDriverDownloader;
import minium.developer.webdriver.DriverLocator;
import minium.developer.webdriver.GeckoDriverDownloader;
import minium.developer.webdriver.IEDriverDownloader;
import minium.developer.webdriver.PhantomJSDownloader;
import minium.developer.webdriver.RuntimeConfig;
import minium.developer.webdriver.WebDriverRelease;
import minium.developer.webdriver.WebDriverReleaseManager;
import minium.web.config.WebDriverFactory;

@Service
public class WebDriverService {

    @Autowired
    private DriverLocator driverLocator;

    @Autowired
    @Lazy
    private WebDriverReleaseManager releaseManager;

    @Autowired
    private WebDriversProperties webDriversProperties;

    @Autowired
    protected WebDriverFactory webDriverFactory;

    private ChromeDriverDownloader chromeDownloader;
    private GeckoDriverDownloader geckoDownloader;
    private IEDriverDownloader ieDownloader;
    private PhantomJSDownloader phantomJSDownloader;

    public static enum WebDriverType {
        CHROME, FIREFOX, IE, SAFARI, PHANTOMJS
    }

    public void webDriverExists(String browserName) throws IOException {
        if (!driverLocator.webDriverExists(browserName)) {

            // download the webdrivers
            switch (browserName) {
            case "chrome":
                downloadChromeDriver();
                break;
            case "firefox":
                downloadGeckoDriver();
                break;
            case "internet explorer":
                downloadIEDriver();
                break;
            case "phantomjs":
                downloadPhantomJs();
                break;
            default:
                break;
            }
        }
    }

    protected void downloadChromeDriver() throws IOException {
        WebDriverRelease chromeDriverLatestVersion = releaseManager.getChromeDriverLatestVersion();
        String chromeVersion = chromeDriverLatestVersion.getPrettyPrintVersion(".");
        chromeDownloader = new ChromeDriverDownloader(chromeVersion, driverLocator.getDriversDir().getPath());
        chromeDownloader.download();
    }

    protected void downloadGeckoDriver() throws IOException {
        String geckoDriverLatestVersion = releaseManager.getGeckoDriverLatestVersion();
        geckoDownloader = new GeckoDriverDownloader(geckoDriverLatestVersion, driverLocator.getDriversDir().getPath());
        geckoDownloader.download();
    }

    protected void downloadPhantomJs() throws IOException {
        phantomJSDownloader = new PhantomJSDownloader("1.9.8", driverLocator.getDriversDir().getPath());
        phantomJSDownloader.download();
    }

    protected void downloadIEDriver() throws IOException {
        WebDriverRelease ieDriverLatestVersion = releaseManager.getIeDriverLatestVersion();
        String version = ieDriverLatestVersion.getPrettyPrintVersion(".");
        ieDownloader = new IEDriverDownloader(version, driverLocator.getDriversDir().getPath());
        ieDownloader.download();
    }

    /**
     * Download the webdriver Only download if webdriver doesn't exists
     *
     * @throws IOException
     */
    public void downloadAllWebDrivers() throws IOException {

        if (RuntimeConfig.getOS().isWindows() && !driverLocator.webDriverExists("internet explorer")) {
            downloadIEDriver();
        }

        if (!driverLocator.webDriverExists("phantomjs")) {
            downloadPhantomJs();
        }

        if (!driverLocator.webDriverExists("chrome")) {
            downloadChromeDriver();
        }

        if (!driverLocator.webDriverExists("firefox")) {
            downloadGeckoDriver();
        }
    }

    /**
     * Update the version of the webdrivers Even if the webdrivers exists they
     * will updated
     *
     * @throws IOException
     */
    public void updateAllWebDrivers() throws IOException {

        if (RuntimeConfig.getOS().isWindows()) {
            downloadIEDriver();
        }

        downloadPhantomJs();
        downloadChromeDriver();
        downloadGeckoDriver();
    }

    public List<DeveloperWebDriverProperties> getAvailableWebdrivers() {
        return webDriversProperties.getWebdrivers();
    }

    public WebDriver createWebDriver(DeveloperWebDriverProperties webDriverProperties, boolean withRecorder) throws IOException {
        WebDriver webDriver = null;
        if (withRecorder) {
            webDriver = addRecorderPlugin(webDriverProperties, webDriver);
        }
        return webDriver != null ? webDriver : webDriverFactory.create(webDriverProperties);
    }

    protected WebDriver addRecorderPlugin(DeveloperWebDriverProperties webDriverProperties, WebDriver webDriver) throws IOException {
        RecorderProperties recorderProperties = this.webDriversProperties.getWebDriverPropertiesByBrowserName(webDriverProperties.getName()).getRecorder();
        if (recorderProperties != null && recorderProperties.isAvailable()) {
            ChromeOptions options = new ChromeOptions();

            options.addExtensions(recorderProperties.getPath());

            Map<String, Object> prefs = Maps.newHashMap();
            Map<String, Object> devtoolsPrefs = Maps.newHashMap();
            devtoolsPrefs.put("InspectorView.panelOrder", "{\"chrome-extension://" + recorderProperties.getId() + "\":1}");
            devtoolsPrefs.put("shortcutPanelSwitch", true);
            prefs.put("devtools.preferences", devtoolsPrefs);
            options.setExperimentalOption("prefs", prefs);

            options.addArguments("start-maximized");

            webDriverProperties.getDesiredCapabilities().put(ChromeOptions.CAPABILITY, options);
            webDriver = webDriverFactory.create(webDriverProperties);
        }
        return webDriver;
    }

    public boolean isRecorderAvailableForBrowser(String browser) {
        return this.webDriversProperties.getWebDriverPropertiesByBrowserName(browser).getRecorder().isAvailable();
    }

}
