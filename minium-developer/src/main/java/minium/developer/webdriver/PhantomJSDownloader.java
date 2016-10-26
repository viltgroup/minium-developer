package minium.developer.webdriver;

import java.io.File;
import java.io.IOException;

import minium.developer.utils.Unzipper;

import org.apache.commons.io.FileUtils;

public class PhantomJSDownloader extends Downloader {

    private String version;

    public PhantomJSDownloader(String version, String destDir) {
        super(destDir, String.format("%s/phantomjs-%s-%s", RuntimeConfig.getPhantomjsUrl(), version, getOsPackage()));
        this.version = version;
    }

    @Override
    public void download() throws IOException {
        File compressedFile = doDownload();

        // extract the downloaded archive
        String driver = "phantomjs", driverPath = "phantomjs";
        if (RuntimeConfig.getOS().isWindows() || RuntimeConfig.getOS().isMac()) {
            Unzipper.unzip(compressedFile, getDestinationDir());
        } else {
            Unzipper.untar(compressedFile, getDestinationDir());
        }

        // extract the executable
        if (RuntimeConfig.getOS().isWindows()) {
            driver = driver + ".exe";
            driverPath = driver;
        } else {
            driverPath = "bin/" + driverPath;
        }

        String sourceUrl = String.format("phantomjs-%s-%s", version, getOSName());
        File tempUnzipedExecutable = new File(getDestinationDir(), sourceUrl + "/" + driverPath);
        setExecutablePermissions(tempUnzipedExecutable);

        File finalExecutable = new File(getDestinationDir(), driver);

        if (!finalExecutable.exists()) {
            FileUtils.moveFile(tempUnzipedExecutable, finalExecutable);
        }

        // delete the extractedFile
        File file = new File(getDestinationDir(), sourceUrl);
        FileUtils.deleteDirectory(file);
    }

    protected String getOSName() {
        String os;

        if (RuntimeConfig.getOS().isWindows()) {
            os = "windows";
        } else if (RuntimeConfig.getOS().isMac()) {
            os = "macosx";
        } else {
            os = "linux" + getLinuxBitVersion();
        }

        return os;
    }

    protected static String getOsPackage() {
        String packageOs;

        if (RuntimeConfig.getOS().isWindows()) {
            packageOs = "windows.zip";
        } else if (RuntimeConfig.getOS().isMac()) {
            packageOs = "macosx.zip";
        } else {
            packageOs = "linux" + getLinuxBitVersion() + ".tar.bz2";
        }

        return packageOs;
    }

    protected static String getLinuxBitVersion() {
        return "64".equals(RuntimeConfig.getOS().getBitVersion()) ? "-x86_64" : "-i686";
    }

}
