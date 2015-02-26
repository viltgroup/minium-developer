package minium.automator.config;

import java.io.File;

import org.kohsuke.args4j.Argument;
import org.kohsuke.args4j.Option;

public class AutomatorProperties {

    @Option(name = "-f", aliases = "--file", metaVar = "FILE", usage = "script file to run")
    private File file;

    @Option(name = "-b", aliases = "--browser", metaVar = "BROWSER", usage = "browser where scripts will be executed against (supported values: chrome, ie, firefox, safari, opera, phantomjs)")
    private String browser = "chrome";

    @Option(name = "-m", aliases = "--module-paths", metaVar = "MODULE_PATHS")
    private String[] modulePaths;

    @Option(name = "-d", aliases = "--dir", metaVar = "DIR")
    private File dir;

    @Option(name = "-h", aliases = "--help", usage = "display this help and exit")
    private boolean help;

    @Option(name = "-v", aliases = "--version", usage = "show version")
    private boolean version;

    @Argument(metaVar = "SCRIPT", usage = "script instructions to run. if --file is passed, SCRIPT is always executed before, so you can set variables for script file execution")
    private String script;

    public String getBrowser() {
        return browser;
    }

    public void setBrowser(String browser) {
        this.browser = browser;
    }

    public File getFile() {
        if (file == null && dir != null) {
            File file = new File(dir, "main.js");
            return file.exists() ? file : null;
        }
        return file;
    }

    public void setFile(File file) {
        this.file = file;
    }

    public File getDir() {
        return dir;
    }

    public void setDir(File dir) {
        this.dir = dir;
    }

    public String[] getModulePaths() {
        if (modulePaths == null && dir != null) {
            File moduleDir = new File(dir, "modules");
            return moduleDir.exists() ? new String[] { moduleDir.getAbsolutePath() } : null;
        }
        return modulePaths;
    }

    public void setModulePaths(String[] modulePaths) {
        this.modulePaths = modulePaths;
    }

    public String getScript() {
        return script;
    }

    public void setScript(String script) {
        this.script = script;
    }

    public boolean isHelp() {
        return help;
    }

    public void setHelp(boolean help) {
        this.help = help;
    }

    public boolean isVersion() {
        return version;
    }

    public void setVersion(boolean version) {
        this.version = version;
    }
}
