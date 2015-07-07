package minium.developer.webdriver;

import java.io.File;
import java.net.MalformedURLException;
import java.net.URL;

import org.dom4j.DocumentException;
import org.springframework.beans.factory.annotation.Value;

import com.google.common.base.Throwables;

public class RuntimeConfig {

    private static OS currentOS = new OS();
    private static WebDriverReleaseManager releaseManager;

    @Value("${app.home:.}")
    private File homedir;

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

    public String getDriverPath() {
        return getDriversDir().getPath();
    }

    protected File getDriversDir() {
        File driverDir = homedir == null ? null : new File(homedir, "drivers");
        return driverDir != null && driverDir.exists() && driverDir.isDirectory() ? driverDir : null;
    }

    public static String getPhantomjsUrl() {
        return PHANTOMJS_URL;
    }
}
