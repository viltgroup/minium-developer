package minium.pupino.jenkins;

import java.net.MalformedURLException;
import java.net.URL;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "minium.manager.jenkins")
public class JenkinsProperties {

    private URL url;
    private String username = "admin";
    private String password = "admin";

    public JenkinsProperties() throws MalformedURLException {
        url = new URL("http://localhost:8080/jenkins/");
    }

    public URL getUrl() {
        return url;
    }

    public void setUrl(URL url) {
        this.url = url;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
