package minium.developer.webdriver;

import java.io.File;
import java.io.IOException;

import minium.developer.utils.Unzipper;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class ChromeDriverDownloader extends Downloader {

    private String version;

    private static final Logger LOGGER = LoggerFactory.getLogger(ChromeDriverDownloader.class);

    public ChromeDriverDownloader(String version, String destDir) {
        super(destDir, "http://chromedriver.storage.googleapis.com/" + version + "/chromedriver_" + getOSName() + ".zip");
        this.version = version;
    }

    @Override
    public void download() throws IOException {
        LOGGER.info("Downloading from " + getSourceURL());
        File zipFile = doDownload();
        Unzipper.unzip(zipFile.getAbsolutePath(), getDestinationDir());
        String chromedriver = "chromedriver";
        if (RuntimeConfig.getOS().isWindows()) {
            chromedriver = chromedriver + ".exe";
        }

        File finalExecutable = new File(getDestinationDir(), chromedriver);
        finalExecutable.setExecutable(true, false);
        finalExecutable.setReadable(true, false);

        LOGGER.info("Driver extracted to  " + finalExecutable.getAbsolutePath());
    }

    public String getVersion() {
        return version;
    }

    protected static String getOSName() {
        String os;

        if (RuntimeConfig.getOS().isWindows()) {
            os = "win";
        } else if (RuntimeConfig.getOS().isMac()) {
            os = "mac";
        } else {
            os = "linux";
        }

        return os + getBitVersion();
    }

    protected static String getBitVersion() {
        OS os = RuntimeConfig.getOS();
        if (os.isMac() || os.isWindows()) {
            // HACK - this driver only exists in 32 bits for Mac and Windows
            return "32";
        }
        return os.getBitVersion();
    }
}