package minium.developer.webdriver;

import java.io.File;
import java.io.IOException;

import minium.developer.utils.Unzipper;

public class GeckoDriverDownloader extends Downloader {

    public GeckoDriverDownloader(String version, String destinationDir) {
        super(destinationDir, getSourceUrl(version));
    }
    
    protected static String getSourceUrl(String version) {
        String sourceUrl = RuntimeConfig.getGeckoDriverReleasesUrl() + "/download/v" + version + "/geckodriver-v" + version + "-";
        OS os =  RuntimeConfig.getOS();
        if (os.isWindows()) {
            sourceUrl += os.getBitVersion().equals("64") ? "win64.zip" : "win32.zip";
        } else if (os.isMac()){
            sourceUrl += "macos.tar.gz";
        } else {
            sourceUrl += os.getBitVersion().equals("64") ? "linux64.tar.gz" : "linux32.tar.gz";
        }
        return sourceUrl;
    }

    @Override
    public void download() throws IOException {
        File archive = doDownload();
        if (RuntimeConfig.getOS().isWindows()) {
            Unzipper.unzip(archive, getDestinationDir());
        } else {
            Unzipper.untar(archive, getDestinationDir());
        }
        
        String driverFileName = "geckodriver";
        if (RuntimeConfig.getOS().isWindows()) {
            driverFileName += ".exe";
        }

        setExecutablePermissions(new File(getDestinationDir(), driverFileName));
    }

}
