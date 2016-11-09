package minium.developer.webdriver;

import java.io.IOException;
import java.io.InputStream;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.HashMap;
import java.util.Iterator;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;

import org.apache.commons.io.IOUtils;
import org.dom4j.Document;
import org.dom4j.DocumentException;
import org.dom4j.Element;
import org.dom4j.io.SAXReader;
import org.jsoup.Jsoup;
import org.jsoup.select.Elements;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Component;

import com.google.common.base.Throwables;

@Component
@Lazy
public class WebDriverReleaseManager {

    private static final String WEBDRIVER_JAR = "webdriver-jar";
    private static final String IE_DRIVER = "ie-driver";
    private static final String CHROME_DRIVER = "chrome-driver";
    private WebDriverRelease latestWebdriverVersion;
    private WebDriverRelease latestIEDriverVersion;
    private WebDriverRelease latestChromeDriverVersion;

    private Document parsedXml;
    private static Logger logger = LoggerFactory.getLogger(WebDriverReleaseManager.class);

    private Map<String, List<WebDriverRelease>> allProducts;

    public WebDriverReleaseManager() throws DocumentException, MalformedURLException {
        URL webDriverAndIEDriverURL = new URL(RuntimeConfig.getSeleniumUrl());
        URL chromeDriverVersionURL = new URL(RuntimeConfig.getChromeDriverUrl());
        logger.info("Checking the latest version of WebDriver, IEDriver, ChromeDriver from " + webDriverAndIEDriverURL.toExternalForm() + " and "
                + chromeDriverVersionURL.toExternalForm());

        initialize();

        SAXReader reader = new SAXReader();
        parsedXml = reader.read(webDriverAndIEDriverURL);
        loadWebDriverAndIEDriverVersions(parsedXml);
        loadChromeDriverVersionFromURL(chromeDriverVersionURL);
    }

    private void initialize() {
        allProducts = new HashMap<String, List<WebDriverRelease>>();
        allProducts.put(WEBDRIVER_JAR, new LinkedList<WebDriverRelease>());
        allProducts.put(IE_DRIVER, new LinkedList<WebDriverRelease>());
        allProducts.put(CHROME_DRIVER, new LinkedList<WebDriverRelease>());
    }

    public int getWebdriverVersionCount() {
        return allProducts.get(WEBDRIVER_JAR).size();
    }

    public int getIEDriverVersionCount() {
        return allProducts.get(IE_DRIVER).size();
    }

    public WebDriverRelease getWedriverLatestVersion() {
        if (this.latestWebdriverVersion == null) {
            this.latestWebdriverVersion = findLatestRelease(allProducts.get(WEBDRIVER_JAR));
        }

        return this.latestWebdriverVersion;
    }

    public WebDriverRelease getIeDriverLatestVersion() {

        if (this.latestIEDriverVersion == null) {
            this.latestIEDriverVersion = findLatestRelease(allProducts.get(IE_DRIVER));
        }

        return this.latestIEDriverVersion;
    }

    public WebDriverRelease getChromeDriverLatestVersion() {
        return this.latestChromeDriverVersion;
    }

    public String getGeckoDriverLatestVersion() {
        try {
            org.jsoup.nodes.Document doc = Jsoup.connect(RuntimeConfig.getGeckoDriverReleasesUrl()).get();
            Elements versionElement = doc.select(".release.label-latest span.css-truncate-target");
            if (versionElement.size() != 1) {
                logger.debug("The method that returns the latest version of geckodriver might not be working as expected.");
            }
            return versionElement.get(0).text().substring(1);
        } catch (IOException e) {
            logger.error("Couldn't get the latest version of geckodriver.", e);
            return "0.11.1";
        }
    }

    private WebDriverRelease findLatestRelease(List<WebDriverRelease> list) {

        WebDriverRelease highestVersion = null;

        for (WebDriverRelease r : list) {

            if (highestVersion == null) {
                highestVersion = r;
            } else if (r.isMoreRecentThan(highestVersion)) {
                highestVersion = r;
            }
        }

        return highestVersion;
    }

    public void loadChromeDriverVersionFromURL(URL url) {
        InputStream in = null;
        try {
            in = url.openStream();
            loadChromeDriverVersion(IOUtils.toString(in));
        } catch (IOException e) {
            logger.error("Something went wrong when trying to get latest chrome driver version");
            throw Throwables.propagate(e);
        } finally {
            IOUtils.closeQuietly(in);
        }
    }

    public void loadChromeDriverVersion(String version) {
        this.latestChromeDriverVersion = new ChromeDriverRelease(version);
    }

    public void loadWebDriverAndIEDriverVersions(Document xml) {
        Element root = xml.getRootElement();
        for (Iterator i = root.elementIterator("Contents"); i.hasNext();) {
            Element node = (Element) i.next();

            WebDriverRelease release = new WebDriverRelease(node.elementText("Key"));

            if (release.getName() == null) {

            } else if ("selenium-server-standalone".equals(release.getName())) {
                allProducts.get(WEBDRIVER_JAR).add(release);
            } else {
                allProducts.get(IE_DRIVER).add(release);
            }
        }
    }

}