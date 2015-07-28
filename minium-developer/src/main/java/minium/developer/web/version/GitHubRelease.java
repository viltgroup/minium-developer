package minium.developer.web.version;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import minium.developer.utils.HttpClientUtils;

public class GitHubRelease extends MiniumReleaseManager {

    protected static final String GITHUB_OWNER = "viltgroup";
    protected static final String GITHUB_REPOSITORY = "minium-tools";
    protected static final String GITHUB_RELEASES_ALL = "https://api.github.com/repos/{owner}/{repository}/releases";

    public GitHubRelease(HttpClientUtils httpClient) {
        super(httpClient);
    }

    @Override
    public Release getLastRelease() throws IOException {
        List<Release> latest = getLatest();
        return (!latest.isEmpty() && latest != null) ? latest.get(0) : null;
    }

    private List<Release> getLatest() throws IOException {
        ArrayList<Release> releases = new ArrayList<>();

        String apiUrl = getAllReleasesString();
        String response = httpClient.simpleRequest(apiUrl);
        releases.addAll(Arrays.asList(objectMapper.readValue(response, Release[].class)));
        return releases;
    }

    private String getAllReleasesString() {
        return GITHUB_RELEASES_ALL.replace("{owner}", GITHUB_OWNER).replace("{repository}", GITHUB_REPOSITORY);
    }

}
