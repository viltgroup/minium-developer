package minium.developer.webdriver;

import java.io.File;
import java.io.IOException;

import minium.developer.utils.Unzipper;

import org.apache.log4j.Logger;

public class IEDriverDownloader extends Downloader {

    private static Logger logger = Logger.getLogger(IEDriverDownloader.class);

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

        finalExecutable.setExecutable(true, false);
        finalExecutable.setReadable(true, false);
    }

    protected static String generateSourceUrl(String version) {
        return "https://selenium-release.storage.googleapis.com/" + version.substring(0, version.lastIndexOf('.')) + "/IEDriverServer_" + getBitVersion() + "_" + version + ".zip";
    }

    protected static String getBitVersion() {
        return "Win32";
    }
}
