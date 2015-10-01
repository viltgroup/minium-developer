package minium.developer.config;

import java.util.List;

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

    }

    public List<DeveloperWebDriverProperties> getWebdrivers() {
        return webdrivers;
    }

    public void setWebdrivers(List<DeveloperWebDriverProperties> webdrivers) {
        this.webdrivers = webdrivers;
    }
}
