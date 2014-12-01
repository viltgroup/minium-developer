package minium.pupino.browser;

import java.awt.Desktop;
import java.io.IOException;
import java.net.URI;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.web.ServerProperties;

public class BrowserLauncher {

    private static final Logger LOGGER = LoggerFactory.getLogger(BrowserLauncher.class);

    @Autowired
    private ServerProperties serverProperties;

    public void launch() {
        Integer port = serverProperties.getPort();
        String contextPath = serverProperties.getContextPath();

        if (contextPath == null) contextPath = "";

        if (port != null && Desktop.isDesktopSupported()) {
            String url = String.format("http://localhost:%d%s", port, contextPath);
            try {
                Desktop.getDesktop().browse(URI.create(url));
            } catch (IOException e) {
                LOGGER.warn("Could not open browser at {}", url, e);
            }
        }
    }

}
