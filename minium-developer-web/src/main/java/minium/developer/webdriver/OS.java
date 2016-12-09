package minium.developer.webdriver;


public class OS {

    private static final String WINDOWS = "Windows";
    private static final String MAC = "Mac";
    private static final String OS_NAME = "os.name";
    private static final String USER_HOME = "user.home";
    private static final String USER_NAME = "user.name";
    private static final String FILE_SEPARATOR = "file.separator";
    private static final String PATH_SEPARATOR = "path.separator";
    private static final String OS_ARCH = "os.arch";

    public boolean isWindows() {
        return getOSName().startsWith(WINDOWS);
    }

    public boolean isMac() {
        return getOSName().startsWith(MAC);
    }

    public String getOSName() {
        return System.getProperty(OS_NAME);
    }

    public String getUserHome() {
        return System.getProperty(USER_HOME);
    }

    public String getUserName() {
        return System.getProperty(USER_NAME);
    }

    public String getFileSeparator() {
        return System.getProperty(FILE_SEPARATOR);
    }

    public String getPathSeparator() {
        return System.getProperty(PATH_SEPARATOR);
    }

    public String getBitVersion() {
        String arch = System.getProperty(OS_ARCH);
        return arch.endsWith("64") ? "64" : "32";
    }

}
