package minium.developer.webdriver;

import java.io.File;
import java.io.IOException;
import java.net.URL;

import org.apache.commons.io.FileUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public abstract class Downloader {

    protected String errorMessage = "";
    protected String sourceURL;
    protected String destinationDir;

    private static Logger logger = LoggerFactory.getLogger(Downloader.class);

    public Downloader(String destinationDir, String sourceURL) {
        this.destinationDir = destinationDir;
        this.sourceURL = sourceURL;
    }

    public abstract void download() throws IOException;

    public String getSourceURL() {
        return sourceURL;
    }

    public String getDestinationDir() {
        return destinationDir;
    }

    public String getErrorMessage() {
        return errorMessage;
    }

    public void setErrorMessage(String errorMessage) {
        this.errorMessage = errorMessage;
    }

    protected File doDownload() throws IOException {
        URL url = new URL(getSourceURL());
        File tmpFile = File.createTempFile("minium_dl_", ".tmp");
        tmpFile.deleteOnExit();
        logger.info("Starting to download from " + url);
        FileUtils.copyURLToFile(url, tmpFile);
        logger.info("Download complete to " + tmpFile);
        return tmpFile;
    }
}