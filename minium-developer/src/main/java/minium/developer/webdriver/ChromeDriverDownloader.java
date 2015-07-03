package minium.developer.webdriver;

import java.io.File;

import minium.developer.utils.Unzipper;

import org.jboss.logging.Logger;

public class ChromeDriverDownloader extends Downloader {

    private String bit;
    private String version;

    private static Logger logger = Logger.getLogger(ChromeDriverDownloader.class);

    public ChromeDriverDownloader(String version, String bitVersion,String destDir) {
        setDestinationDir(destDir);
        setVersion(version);
        setBitVersion(bitVersion);

        setDestinationFile(getVersion() + "_" + getBitVersion() + "bit" + ".zip");

        setSourceURL("http://chromedriver.storage.googleapis.com/" + getVersion() + "/chromedriver_" + getOSName() + getBitVersion() + ".zip");

    }

    @Override
    public void setSourceURL(String source) {
        sourceURL = source;
    }

    @Override
    public void setDestinationFile(String destination) {
        destinationFile = destination;
    }

    @Override
    public void setDestinationDir(String dir) {
        destinationDir = dir;
    }

    @Override
    public boolean download() {

        logger.info("Downloading from " + getSourceURL());

        if (startDownload()) {

            if (Unzipper.unzip(getDestinationFileFullPath().getAbsolutePath(), getDestinationDir())) {

                String chromedriver = "chromedriver";
                if (RuntimeConfig.getOS().isWindows()) {
                    chromedriver = chromedriver + ".exe";
                }

                File tempUnzipedExecutable = new File(getDestinationDir(), chromedriver);
                File finalExecutable = new File(RuntimeConfig.getDriverPath(),chromedriver);

                tempUnzipedExecutable.renameTo(finalExecutable);

                setDestinationFile(finalExecutable.getAbsolutePath());

                finalExecutable.setExecutable(true, false);
                finalExecutable.setReadable(true, false);

                return true;
            }
        }
        return false;
    }

    public String getBitVersion() {
        return bit;
    }

    public void setBitVersion(String bit) {
        this.bit = bit;
    }

    public String getVersion() {
        return version;
    }

    public void setVersion(String version) {
        this.version = version;
    }

    protected String getOSName() {
        String os;

        if (RuntimeConfig.getOS().isWindows()) {
            os = getWindownsName();
        } else if (RuntimeConfig.getOS().isMac()) {
            os = getMacName();
        } else {
            os = getLinuxName();
        }

        return os;
    }

    public String getLinuxName() {
        return "linux";
    }

    public String getMacName() {
        return "mac";
    }

    public String getWindownsName() {
        return "win";
    }

}