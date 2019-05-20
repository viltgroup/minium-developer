package minium.developer.service;

import java.io.File;
import java.io.IOException;
import java.util.List;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.remote.BrowserType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;

import minium.developer.config.WebDriversProperties;
import minium.developer.config.WebDriversProperties.DeveloperWebDriverProperties;
import minium.developer.webdriver.ChromeDriverDownloader;
import minium.developer.webdriver.DriverLocator;
import minium.developer.webdriver.GeckoDriverDownloader;
import minium.developer.webdriver.IEDriverDownloader;
import minium.developer.webdriver.RuntimeConfig;
import minium.developer.webdriver.WebDriverRelease;
import minium.developer.webdriver.WebDriverReleaseManager;
import minium.web.config.WebDriverFactory;
import minium.web.config.WebDriverProperties.ChromeOptionsProperties;

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

    public static enum WebDriverType {
        CHROME, FIREFOX, IE, SAFARI
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
            default:
                break;
            }
        }
    }

    protected void downloadChromeDriver() throws IOException {
        WebDriverRelease chromeDriverLatestVersion = releaseManager.getChromeDriverLatestVersion();
		String chromeVersion = chromeDriverLatestVersion.getVersion();
        chromeDownloader = new ChromeDriverDownloader(chromeVersion, driverLocator.getDriversDir().getPath());
        chromeDownloader.download();
    }

    protected void downloadGeckoDriver() throws IOException {
        String geckoDriverLatestVersion = releaseManager.getGeckoDriverLatestVersion();
        geckoDownloader = new GeckoDriverDownloader(geckoDriverLatestVersion, driverLocator.getDriversDir().getPath());
        geckoDownloader.download();
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

        downloadChromeDriver();
        downloadGeckoDriver();
    }

    public List<DeveloperWebDriverProperties> getAvailableWebdrivers() {
        return webDriversProperties.getWebdrivers();
    }

    public WebDriver createWebDriver(DeveloperWebDriverProperties webDriverProperties) throws IOException {
        return webDriverFactory.create(webDriverProperties);
    }

    public boolean isRecorderAvailableForBrowser(String browser) {
        if (browser.equals(BrowserType.CHROME)) {
            ChromeOptionsProperties options = webDriversProperties.getWebDriverPropertiesByBrowserName(browser).getChromeOptions();
            if (options == null) return false;

            List<File> extensions = options.getExtensions();
            return extensions != null && extensions.stream().anyMatch(extension -> extension.getName().contains("recorder"));
        } else {
            return false;
        }
    }

}
