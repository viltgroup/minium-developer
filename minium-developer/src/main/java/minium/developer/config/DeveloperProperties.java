package minium.developer.config;

import org.kohsuke.args4j.Argument;
import org.kohsuke.args4j.Option;

public class DeveloperProperties {

    @Option(name = "-b", aliases = "--browser", metaVar = "BROWSER", usage = "Launch Minium Developer in the browser")
    private boolean browser;

    public boolean isBrowser() {
        return browser;
    }

    public void setBrowser(boolean automate) {
        this.browser = automate;
    }
}
