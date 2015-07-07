package minium.developer.webdriver;

import java.io.File;
import java.io.IOException;
import java.net.MalformedURLException;
import java.net.URL;

import org.apache.commons.io.FileUtils;
import org.apache.log4j.Logger;

public abstract class Downloader {

    protected String errorMessage = "";
    protected String sourceURL;
    protected String destinationFile;
    protected String destinationDir;

    private static Logger logger = Logger.getLogger(Downloader.class);

    public boolean download() {
        return startDownload();
    }

    public File getDestinationFileFullPath() {
        File dir = new File(getDestinationDir());
        File file = new File(getDestinationFile());
        File combined = new File(dir.getAbsolutePath() + file.getName());
        return combined;
    }

    public String getDestinationFile() {
        return destinationFile;
    }

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

    protected boolean startDownload() {
        try {
            URL url = new URL(getSourceURL());
            logger.info("Starting to download from " + url);
            FileUtils.copyURLToFile(url, getDestinationFileFullPath());
            logger.info("Download complete to " + getDestinationFileFullPath());
            return true;
        } catch (MalformedURLException error) {
            logger.error(error.toString());
            setErrorMessage(error.toString());
        } catch (IOException error) {
            logger.error(error.toString());
            setErrorMessage(error.toString());
        }
        logger.error("Download failed");
        return false;
    }

    public abstract void setSourceURL(String source);

    public abstract void setDestinationFile(String destination);

    public abstract void setDestinationDir(String dir);

}