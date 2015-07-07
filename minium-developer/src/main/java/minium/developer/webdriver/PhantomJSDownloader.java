package minium.developer.webdriver;

import java.io.File;
import java.io.IOException;

import minium.developer.utils.Unzipper;

import org.apache.commons.io.FileUtils;

import com.google.common.base.Throwables;

public class PhantomJSDownloader extends Downloader {

    private String bit;
    private String version;

    public PhantomJSDownloader(String version, String bitVersion, String destDir) {
        setDestinationDir(destDir);
        setVersion(version);
        setBitVersion(bitVersion);

        setDestinationFile(getVersion() + "_" + getBitVersion() + getOsPackage());

        String sourceUrl = String.format("%s/phantomjs-%s-%s", RuntimeConfig.getPhantomjsUrl(), getVersion(), getOsPackage());
        setSourceURL(sourceUrl);

    }

    private void extractZip() {
        Unzipper.unzip(getDestinationFileFullPath().getAbsolutePath(), getDestinationDir());
    }

    private void extractTar() {
        Unzipper.untar(getDestinationFileFullPath().getAbsolutePath(), getDestinationDir());
    }

    @Override
    public boolean download() {

        if (startDownload()) {
            try {
                // extract the downloaded archive
                String driver = "phantomjs", driverPath = "phantomjs";
                if (RuntimeConfig.getOS().isWindows() || RuntimeConfig.getOS().isMac()) {
                    extractZip();
                } else {
                    extractTar();
                }

                // extract the executable
                if (RuntimeConfig.getOS().isWindows()) {
                    driver = driver + ".exe";
                    driverPath = driver;
                } else {
                    driverPath = "bin/" + driverPath;
                }

                String sourceUrl = String.format("phantomjs-%s-%s", getVersion(), getOSName());
                File tempUnzipedExecutable = new File(getDestinationDir(), sourceUrl + "/" + driverPath);
                tempUnzipedExecutable.setExecutable(true, false);
                tempUnzipedExecutable.setReadable(true, false);

                File finalExecutable = new File(getDestinationDir(), driver);

                if (!finalExecutable.exists()) {
                    FileUtils.moveFile(tempUnzipedExecutable, finalExecutable);
                }

                // delete the extractedFile
                File file = new File(getDestinationDir(), sourceUrl);
                FileUtils.deleteDirectory(file);

            } catch (IOException e) {
                throw Throwables.propagate(e);
            }
            return true;
        }
        return false;
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
        return "linux" + getLinuxBitVersion();
    }

    public String getMacName() {
        return "macosx";
    }

    public String getWindownsName() {
        return "windows";
    }

    protected String getOsPackage() {
        String packageOs;

        if (RuntimeConfig.getOS().isWindows()) {
            packageOs = getWindownsPackage();
        } else if (RuntimeConfig.getOS().isMac()) {
            packageOs = getMacPackage();
        } else {
            packageOs = getLinuxPackage();
        }

        return packageOs;
    }

    public String getLinuxPackage() {
        return "linux" + getLinuxBitVersion() + ".tar.bz2";
    }

    public String getMacPackage() {
        return "macosx.zip";
    }

    public String getWindownsPackage() {
        return "windows.zip";
    }

    protected String getLinuxBitVersion(){
        return RuntimeConfig.getOS().getBitVersion().equals("64") ? "-x86_64" : "-i686";
    }

}
