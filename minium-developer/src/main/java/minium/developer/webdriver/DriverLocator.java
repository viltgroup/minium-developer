package minium.developer.webdriver;

import java.io.File;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class DriverLocator {

    private static OS currentOS = new OS();;

    @Value("${app.home:.}")
    private File homedir;

    public boolean webDriverExists(String browser) {
        switch (browser) {
        case "chrome":
            return chromeDriverExists();
        case "internet explorer":
            return ieDriverExists();
        case "phantomjs":
            return phantomJsDriverExists();
        default:
            break;
        }
        return false;
    }

    protected boolean ieDriverExists() {
        File ieDriverExe = findExecutable("IEDriverServer");
        return ieDriverExe != null ? true : false;
    }

    protected boolean chromeDriverExists() {
        File chromedriverExe = findExecutable("chromedriver");
        return chromedriverExe != null ? true : false;
    }

    protected boolean phantomJsDriverExists() {
        File phantomjsExe = findExecutable("phantomjs");
        return phantomjsExe != null ? true : false;
    }

    protected File findExecutable(String exeName) {
        File driversDir = getDriversDir();
        if (driversDir == null) {
            return null;
        }

        String osSpecificExeName = currentOS.isWindows() ? exeName + ".exe" : exeName;
        File exeFile = new File(driversDir, osSpecificExeName);

        return exeFile.exists() && exeFile.isFile() && exeFile.canExecute() ? exeFile : null;
    }

    public File getDriversDir() {
        File driverDir = homedir == null ? null : new File(homedir, "drivers");
        boolean driverDirISNotNullAndExistsAndIsADir = driverDir != null && driverDir.exists() && driverDir.isDirectory();
        return driverDirISNotNullAndExistsAndIsADir ? driverDir : (driverDir.mkdir() ? driverDir : null);
    }

}
