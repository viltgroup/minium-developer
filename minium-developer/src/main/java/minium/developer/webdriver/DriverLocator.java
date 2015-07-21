package minium.developer.webdriver;

import java.io.File;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class DriverLocator {

    private static OS currentOS = new OS();

    @Value("${app.home:.}")
    private File homedir;


    public boolean webDriverExists(String browser) {
        switch (browser) {
        case "chrome":
            return chromeDriverExists();
        case "internet explorer":
            return IEDriverExists();
        case "phantomjs":
            return phantomJsDriverExists();
        default:
            break;
        }
        return false;
    }

    protected boolean IEDriverExists() {
        File chromedriverExe = findExecutable("IEDriverServer");
        if (chromedriverExe != null) {
            return true;
        } else {
            return false;
        }
    }

    protected boolean chromeDriverExists() {
        File ieDriverExe = findExecutable("chromedriver");
        if (ieDriverExe != null) {
            return true;
        } else {
            return false;
        }
    }

    protected boolean phantomJsDriverExists() {
        File phantomjsExe = findExecutable("phantomjs");
        if (phantomjsExe != null) {
            return true;
        } else {
            return false;
        }
    }

    protected File findExecutable(String exeName) {
        File driversDir = getDriversDir();
        if (driversDir == null)
            return null;

        String osSpecificExeName = currentOS.isWindows() ? exeName + ".exe" : exeName;
        File exeFile = new File(driversDir, osSpecificExeName);

        return exeFile.exists() && exeFile.isFile() && exeFile.canExecute() ? exeFile : null;
    }

    public File getDriversDir() {
        File driverDir = homedir == null ? null : new File(homedir, "drivers");
        return driverDir != null && driverDir.exists() && driverDir.isDirectory() ? driverDir : (driverDir.mkdir() ? driverDir : null) ;
    }

}
