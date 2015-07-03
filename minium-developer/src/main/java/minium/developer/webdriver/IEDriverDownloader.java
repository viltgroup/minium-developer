package minium.developer.webdriver;

import java.io.File;

import minium.developer.utils.Unzipper;

import org.apache.log4j.Logger;

public class IEDriverDownloader extends Downloader {

    private String bit;
    private String version;

    private static Logger logger = Logger.getLogger(IEDriverDownloader.class);

    public IEDriverDownloader(String version, String bitVersion,String destDir) {
        setDestinationDir(destDir);

        setVersion(version);
        setBitVersion(bitVersion);

        setDestinationFile(getVersion() + getBitVersion() + ".zip");

        String versionMajor = version.substring(0, version.lastIndexOf('.'));
        setSourceURL("https://selenium-release.storage.googleapis.com/" + versionMajor + "/IEDriverServer_" + getBitVersion() + "_" + getVersion() + ".zip");
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

    public void setBitVersion(String bitVersion) {
        this.bit = bitVersion;
    }

    public String getBitVersion() {
        String bitVersion;
        if(bit.equals("32")){
            bitVersion = "Win32";
        }else{
            bitVersion = "x64";
        }
        return bitVersion;
    }

    public void setVersion(String version) {
        this.version = version;
    }

    public String getVersion() {
        return version;
    }

    @Override
    public boolean download() {

        if (startDownload()) {

            if (Unzipper.unzip(getDestinationFileFullPath().getAbsolutePath(), getDestinationDir())) {

                File tempUnzipedExecutable = new File(getDestinationDir(), "IEDriverServer.exe");
                File finalExecutable = new File(RuntimeConfig.getDriverPath(),"IEDriverServer.exe");

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
                setDestinationFile(finalExecutable.getAbsolutePath());

                finalExecutable.setExecutable(true, false);
                finalExecutable.setReadable(true, false);

                return true;
            }
        }
        return false;
    }

}
