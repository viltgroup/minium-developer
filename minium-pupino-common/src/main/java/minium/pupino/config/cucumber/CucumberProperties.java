package minium.pupino.config.cucumber;

import java.util.List;

import org.apache.http.auth.AuthScope;
import org.apache.http.auth.UsernamePasswordCredentials;
import org.apache.http.client.CredentialsProvider;
import org.apache.http.impl.client.BasicCredentialsProvider;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClientBuilder;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.http.client.HttpComponentsClientHttpRequestFactory;
import org.springframework.web.client.RestTemplate;

import com.google.common.base.Objects;
import com.google.common.collect.Lists;

import cucumber.runtime.rest.RemoteBackend;

@ConfigurationProperties(prefix = "cucumber", ignoreUnknownFields = false)
public class CucumberProperties {

    public static class CredentialsProperties {

        private String username;
        private String password;

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

        @Override
        public boolean equals(Object obj) {
            if (obj instanceof CredentialsProperties) {
                CredentialsProperties other = (CredentialsProperties) obj;
                return Objects.equal(this.username, other.username) &&
                        Objects.equal(this.password, other.password);
            }
            return false;
        }

        @Override
        public int hashCode() {
            return Objects.hashCode(username, password);
        }
    }

    public static class RemoteBackendProperties {

        private CredentialsProperties credentials;
        private String url;

        public CredentialsProperties getCredentials() {
            return credentials;
        }

        public void setCredentials(CredentialsProperties credentials) {
            this.credentials = credentials;
        }

        public String getUrl() {
            return url;
        }

        public void setUrl(String url) {
            this.url = url;
        }

        public RemoteBackend createRemoteBackend() {
            CloseableHttpClient httpClient;
            if (credentials != null) {
                CredentialsProvider credsProvider = new BasicCredentialsProvider();
                credsProvider.setCredentials(AuthScope.ANY, new UsernamePasswordCredentials(credentials.getUsername(), credentials.getPassword()));
                httpClient = HttpClientBuilder.create().setDefaultCredentialsProvider(credsProvider).build();
            } else {
                httpClient = HttpClientBuilder.create().build();
            }

            HttpComponentsClientHttpRequestFactory factory = new HttpComponentsClientHttpRequestFactory(httpClient);
            RestTemplate restTemplate = new RestTemplate(factory);
            return new RemoteBackend(url, restTemplate);
        }

        @Override
        public boolean equals(Object obj) {
            if (obj instanceof RemoteBackendProperties) {
                RemoteBackendProperties other = (RemoteBackendProperties) obj;
                return Objects.equal(this.url, other.url) &&
                        Objects.equal(this.credentials, other.credentials);
            }
            return false;
        }

        @Override
        public int hashCode() {
            return Objects.hashCode(url, credentials);
        }
    }

    private List<RemoteBackendProperties> remoteBackends = Lists.newArrayList();

    public List<RemoteBackendProperties> getRemoteBackends() {
        return remoteBackends;
    }

    public void setRemoteBackends(List<RemoteBackendProperties> remoteBackends) {
        this.remoteBackends = remoteBackends;
    }
}
