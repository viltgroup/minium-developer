package minium.developer.config;

import java.io.File;
import java.util.List;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import minium.web.config.WebDriverProperties;

@Component
@ConfigurationProperties(prefix = "minium.developer")
public class WebDriversProperties {

    private List<DeveloperWebDriverProperties> webdrivers;

    public static class RecorderProperties {
        private String id;
        private File path;
        private boolean openOnStartup = true;

        public String getId() {
            return id;
        }

        public void setId(String id) {
            this.id = id;
        }

        public File getPath() {
            return path == null ? null : path.getAbsoluteFile();
        }

        public void setPath(File path) {
            this.path = path;
        }

        public boolean isAvailable() {
            return path != null && path.exists() && path.isFile();
        }

        public boolean isOpenOnStartup() {
            return openOnStartup;
        }

        public void setOpenOnStartup(boolean openOnStartup) {
            this.openOnStartup = openOnStartup;
        }
    }

    public static class DeveloperWebDriverProperties extends WebDriverProperties {
        private String name;
        private String displayName;
        private String iconClass;
        private RecorderProperties recorder = new RecorderProperties();

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public String getDisplayName() {
            return displayName;
        }

        public void setDisplayName(String displayName) {
            this.displayName = displayName;
        }

        public String getIconClass() {
            return iconClass;
        }

        public void setIconClass(String icon) {
            this.iconClass = icon;
        }

        public RecorderProperties getRecorder() {
            return recorder;
        }

        public void setRecorder(RecorderProperties recorder) {
            this.recorder = recorder;
        }
    }

    public List<DeveloperWebDriverProperties> getWebdrivers() {
        return webdrivers;
    }

    public void setWebdrivers(List<DeveloperWebDriverProperties> webdrivers) {
        this.webdrivers = webdrivers;
    }

    public DeveloperWebDriverProperties getWebDriverPropertiesByBrowserName(String browserName) {
        for (DeveloperWebDriverProperties wd : webdrivers) {
            if (wd.getName().equals(browserName))
                return wd;
        }
        return null;
    }
}
