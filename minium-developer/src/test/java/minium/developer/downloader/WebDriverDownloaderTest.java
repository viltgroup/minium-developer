package minium.developer.downloader;

import static org.junit.Assert.assertTrue;

import java.io.File;

import minium.developer.webdriver.ChromeDriverDownloader;
import minium.developer.webdriver.IEDriverDownloader;
import minium.developer.webdriver.PhantomJSDownloader;
import minium.developer.webdriver.RuntimeConfig;
import minium.developer.webdriver.WebDriverRelease;
import minium.developer.webdriver.WebDriverReleaseManager;

import org.apache.commons.lang3.SystemUtils;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;

public class WebDriverDownloaderTest {

    private ChromeDriverDownloader chromeDownloader;
    private IEDriverDownloader IEdownloader;
    private final String downloadDir = SystemUtils.getJavaIoTmpDir().getAbsolutePath();
    private WebDriverReleaseManager releaseManager;

    @Before
    public void setUp() throws Exception {
        releaseManager = RuntimeConfig.getReleaseManager();
    }

    @After
    public void tearDown() throws Exception {
    }

    @Test
    public void testChromeDownload() throws Exception {
        WebDriverRelease chromeDriverLatestVersion = releaseManager.getChromeDriverLatestVersion();
        String chromeVersion = chromeDriverLatestVersion.getPrettyPrintVersion(".");
        chromeDownloader = new ChromeDriverDownloader(chromeVersion, downloadDir);
        chromeDownloader.download();
        File executable = new File(downloadDir, "chromedriver" + (SystemUtils.IS_OS_WINDOWS ? ".exe" : ""));
        assertTrue("Cannot execute", executable.canExecute());
    }

    @Test
    public void testIEDriverServerDownload() throws Exception {
        WebDriverRelease ieDriverLatestVersion = releaseManager.getIeDriverLatestVersion();
        String version = ieDriverLatestVersion.getPrettyPrintVersion(".");
        IEdownloader = new IEDriverDownloader(version, downloadDir);
        IEdownloader.download();
        File executable = new File(downloadDir, "IEDriverServer.exe");
        if (SystemUtils.IS_OS_WINDOWS) {
            assertTrue("Cannot execute", executable.canExecute());
        }
    }

    @Test
    public void testPhantomJSDowload() throws Exception {
        PhantomJSDownloader phantomJSDownloader = new PhantomJSDownloader("1.9.8", downloadDir);
        phantomJSDownloader.download();
        File executable = new File(downloadDir, "phantomjs" + (SystemUtils.IS_OS_WINDOWS ? ".exe" : ""));
        assertTrue("Cannot execute", executable.canExecute());
    }
}