package minium.developer.downloader;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;

import java.io.File;

import minium.developer.webdriver.ChromeDriverDownloader;
import minium.developer.webdriver.IEDriverDownloader;
import minium.developer.webdriver.PhantomJSDownloader;
import minium.developer.webdriver.RuntimeConfig;
import minium.developer.webdriver.WebDriverRelease;
import minium.developer.webdriver.WebDriverReleaseManager;

import org.junit.After;
import org.junit.Before;
import org.junit.Test;

public class WebDriverDownloaderTest {

    private ChromeDriverDownloader chromeDownloader;
    private IEDriverDownloader IEdownloader;
    private final String downloadDir = "/tmp/drivers/download";
    private WebDriverReleaseManager releaseManager;

    @Before
    public void setUp() throws Exception {
        releaseManager = RuntimeConfig.getReleaseManager();
    }

    @After
    public void tearDown() throws Exception {
//        FileUtils.deleteDirectory(new File(downloadDir));
    }


    @Test
    public void testChromeDownload() throws Exception {
        WebDriverRelease chromeDriverLatestVersion = releaseManager.getChromeDriverLatestVersion();
        String chromeVersion = chromeDriverLatestVersion.getPrettyPrintVersion(".");
        chromeDownloader = new ChromeDriverDownloader(chromeVersion, "64", downloadDir);
        chromeDownloader.download();
    }

    @Test
    public void testLastVersionIEDriverDownload() throws Exception {

        WebDriverRelease ieDriverLatestVersion = releaseManager.getIeDriverLatestVersion();
        String version = ieDriverLatestVersion.getPrettyPrintVersion(".");
        IEdownloader = new IEDriverDownloader(version, "32", downloadDir);
        IEdownloader.download();
    }

    @Test
    public void testBitVersion() throws Exception {
        String bitVersion = RuntimeConfig.getOS().getBitVersion();
        assertEquals("64", bitVersion);
    }

    @Test
    public void testPhantomJSDowload() throws Exception {
        PhantomJSDownloader phantomJSDownloader = new PhantomJSDownloader("1.9.8", "64" , downloadDir);
        phantomJSDownloader.download();
        File executable = new File(downloadDir,"phantomjs");
        assertTrue(executable.canExecute());
    }

}
