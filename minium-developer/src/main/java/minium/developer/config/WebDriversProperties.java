package minium.developer.config;

import java.util.List;
import java.util.Map;

import minium.web.config.WebDriverProperties;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties(prefix = "minium.developer")
public class WebDriversProperties {

    private List<DeveloperWebDriverProperties> webdrivers;

    public static class DeveloperWebDriverProperties extends WebDriverProperties {
        private String name;
        private String displayName;
        private String iconClass;
        private Map<String, String> recorderProperties;

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

        public Map<String, String> getRecorderProperties() {
            return recorderProperties;
        }

        public void setRecorderProperties(Map<String, String> recorderProperties) {
            this.recorderProperties = recorderProperties;
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
