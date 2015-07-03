package minium.developer.webdriver;

import java.net.MalformedURLException;
import java.net.URL;

import org.dom4j.DocumentException;

import com.google.common.base.Throwables;

public class RuntimeConfig {

    private static OS currentOS = new OS();
    private static WebDriverReleaseManager releaseManager;

    private static final String DRIVER_PATH = "../drivers";
    private static final String SELENIUM_URL = "https://selenium-release.storage.googleapis.com/";
    private static final String CHROME_DRIVER_URL = "https://chromedriver.storage.googleapis.com/LATEST_RELEASE";
    private static final String PHANTOMJS_URL = "https://bitbucket.org/ariya/phantomjs/downloads";

    public static WebDriverReleaseManager getReleaseManager() {
        if (releaseManager == null) {
            releaseManager = loadWebDriverReleaseManager(SELENIUM_URL, CHROME_DRIVER_URL);
        }
        return releaseManager;
    }

    private static WebDriverReleaseManager loadWebDriverReleaseManager(String webDriverAndIEDriverURL, String chromeDriverUrl) {
        try {
            return new WebDriverReleaseManager(new URL(webDriverAndIEDriverURL), new URL(chromeDriverUrl));
        } catch (MalformedURLException | DocumentException e) {
            throw Throwables.propagate(e);
        }
    }

    public static OS getOS() {
        return currentOS;
    }

    public static String getDriverPath() {
        return DRIVER_PATH;
    }

    public static String getPhantomjsUrl() {
        return PHANTOMJS_URL;
    }
}
