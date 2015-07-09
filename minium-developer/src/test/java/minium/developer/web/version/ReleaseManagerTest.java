package minium.developer.web.version;
import java.io.IOException;

import minium.developer.utils.HttpClientUtils;
import minium.developer.web.version.GitHubRelease;
import minium.developer.web.version.MiniumIoRelease;
import minium.developer.web.version.MiniumReleaseManager;
import minium.developer.web.version.Release;

import org.junit.Before;
import org.junit.Test;

public class ReleaseManagerTest {
    private HttpClientUtils httpClient;
    private MiniumReleaseManager releaseManager;

    @Before
    public void setup() {
        httpClient = new HttpClientUtils();

    }

    @Test
    public void testReleaseManagerGitHub() throws IOException {
        releaseManager = new GitHubRelease(httpClient);
        Release lastGitHubRelease = releaseManager.getLastRelease();
        lastGitHubRelease.getTagName();
    }

    @Test
    public void testReleaseManagerFromMIniumIO() throws IOException {
        releaseManager = new MiniumIoRelease(httpClient);
        Release lastRelease = releaseManager.getLastRelease();
    }

    @Test
    public void testGotTheLastVersion() throws IOException {
        releaseManager = new MiniumIoRelease(httpClient);
        boolean gotTheLastVersion = releaseManager.gotTheLastVersion();
    }
}
