package minium.developer.webdriver;

import java.io.File;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class DriverLocator {

    private static OS currentOS = new OS();;

    @Value("${app.home:.}")
    private File homedir;

    protected String getExecutableName(String browser) {
        String executableName = null;

        switch (browser) {
        case "chrome":
            executableName = "chromedriver";
            break;
        case "firefox":
            executableName = "geckodriver";
            break;
        case "internet explorer":
            executableName = "IEDriverServer";
        }

        if (executableName == null) {
            return null;
        }

        return currentOS.isWindows() ? executableName + ".exe" : executableName;
    }

    public boolean webDriverExists(String browser) {
        File executable  = findExecutable(getExecutableName(browser));
        return executable != null;
    }

    protected File findExecutable(String exeName) {
        File driversDir = getDriversDir();
        if (driversDir == null) {
            return null;
        }

        File exeFile = new File(driversDir, exeName);

        return exeFile.exists() && exeFile.isFile() && exeFile.canExecute() ? exeFile : null;
    }

    public File getDriversDir() {
        File driverDir = homedir == null ? null : new File(homedir, "drivers");
        boolean driverDirISNotNullAndExistsAndIsADir = driverDir != null && driverDir.exists() && driverDir.isDirectory();
        return driverDirISNotNullAndExistsAndIsADir ? driverDir : (driverDir.mkdir() ? driverDir : null);
    }

    public String getWebDriverPath(String browser) {
        return getDriversDir().getAbsolutePath() + File.separator + getExecutableName(browser);
    }

}
