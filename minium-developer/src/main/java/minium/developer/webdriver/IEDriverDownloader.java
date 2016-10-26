package minium.developer.webdriver;

import java.io.File;
import java.io.IOException;

import minium.developer.utils.Unzipper;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class IEDriverDownloader extends Downloader {

    private static Logger logger = LoggerFactory.getLogger(IEDriverDownloader.class);

    public IEDriverDownloader(String version, String destDir) {
        super(destDir, generateSourceUrl(version));
    }

    @Override
    public void download() throws IOException {
        File zipFile = doDownload();
        Unzipper.unzip(zipFile.getAbsolutePath(), getDestinationDir());
        File tempUnzipedExecutable = new File(getDestinationDir(), "IEDriverServer.exe");
        File finalExecutable = new File(getDestinationDir(), "IEDriverServer.exe");

        if (tempUnzipedExecutable.exists()) {
            logger.debug(tempUnzipedExecutable.getAbsolutePath());
            logger.debug("It does exist");
            logger.debug(finalExecutable.getAbsolutePath());
        } else {
            logger.debug(tempUnzipedExecutable.getAbsolutePath());
            logger.debug("NO exist");
            logger.debug(finalExecutable.getAbsolutePath());
        }

        tempUnzipedExecutable.renameTo(finalExecutable);

        setExecutablePermissions(finalExecutable);
    }

    protected static String generateSourceUrl(String version) {
        return "https://selenium-release.storage.googleapis.com/" + version.substring(0, version.lastIndexOf('.')) + "/IEDriverServer_" + getBitVersion() + "_" + version + ".zip";
    }

    protected static String getBitVersion() {
        return "Win32";
    }
}
