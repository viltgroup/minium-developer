package minium.pupino.config;

import java.net.URISyntaxException;

import minium.pupino.jenkins.JenkinsClient;
import minium.pupino.jenkins.JenkinsClientAdaptor;
import minium.pupino.jenkins.JenkinsProperties;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.offbytwo.jenkins.JenkinsServer;

@Configuration
@EnableConfigurationProperties(JenkinsProperties.class)
public class JenkinsConfiguration {

    @Bean
    @Autowired
    public JenkinsServer jenkinsServer(JenkinsProperties jenkinsProperties) throws URISyntaxException {
        return new JenkinsServer(jenkinsProperties.getUrl().toURI(), jenkinsProperties.getUsername(), jenkinsProperties.getPassword());
    }

    @Bean
    public JenkinsClient jenkinsClient() throws URISyntaxException {
        return new JenkinsClientAdaptor();
    }
}
