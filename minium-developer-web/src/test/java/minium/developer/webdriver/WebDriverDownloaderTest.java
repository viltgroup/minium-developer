package minium.developer.webdriver;

import static org.junit.Assert.assertTrue;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.spy;
import static org.mockito.Mockito.when;

import java.io.File;

import org.apache.commons.lang3.SystemUtils;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.powermock.api.mockito.PowerMockito;
import org.powermock.core.classloader.annotations.PrepareForTest;
import org.powermock.modules.junit4.PowerMockRunner;

@RunWith(PowerMockRunner.class)
@PrepareForTest(RuntimeConfig.class)
public class WebDriverDownloaderTest {

    private ChromeDriverDownloader chromeDownloader;
    private IEDriverDownloader IEdownloader;
    private final String downloadDir = SystemUtils.getJavaIoTmpDir().getAbsolutePath();
    private WebDriverReleaseManager releaseManager;

    @Before
    public void setUp() throws Exception {
        releaseManager = new WebDriverReleaseManager();
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
    public void testDownloadOfChromeDriverForMac() throws Exception {
        OS osMock = spy(new OS());
        doReturn(false).when(osMock).isWindows();
        doReturn(true).when(osMock).isMac();
        PowerMockito.mockStatic(RuntimeConfig.class);
        when(RuntimeConfig.getOS()).thenReturn(osMock);

        String chromeDriverVersion = releaseManager.getChromeDriverLatestVersion().getPrettyPrintVersion(".");
        chromeDownloader = new ChromeDriverDownloader(chromeDriverVersion, downloadDir);
        chromeDownloader.download();
        assertTrue(new File(downloadDir, "chromedriver").exists());
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
}
