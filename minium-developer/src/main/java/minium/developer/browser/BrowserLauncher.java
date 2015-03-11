package minium.developer.browser;

import java.awt.Desktop;
import java.awt.GraphicsEnvironment;
import java.io.IOException;
import java.net.URI;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.embedded.AbstractConfigurableEmbeddedServletContainer;
import org.springframework.stereotype.Component;

@Component
public class BrowserLauncher {

    private static final Logger LOGGER = LoggerFactory.getLogger(BrowserLauncher.class);

    @Autowired
    private AbstractConfigurableEmbeddedServletContainer servletContainer;

    public void launch() {
        int port = servletContainer.getPort();
        String contextPath = servletContainer.getContextPath();

        if (contextPath == null) contextPath = "";

        if (port >= 0 && !GraphicsEnvironment.isHeadless()) {
            String url = String.format("http://localhost:%d%s#/editor/", port, contextPath);
            try {
                Desktop.getDesktop().browse(URI.create(url));
            } catch (IOException e) {
                LOGGER.warn("Could not open browser at {}", url, e);
            }
        }
    }

}
