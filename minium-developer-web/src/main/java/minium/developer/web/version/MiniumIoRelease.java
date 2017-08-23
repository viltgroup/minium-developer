package minium.developer.web.version;

import java.io.IOException;

import minium.developer.utils.HttpClientUtils;

public class MiniumIoRelease extends MiniumReleaseManager {

    protected static final String MINIUM_URl = "https://minium.vilt.io/last-version.json";

    public MiniumIoRelease(HttpClientUtils httpClient) {
        super(httpClient);
    }

    @Override
    public Release getLastRelease() throws IOException {
        String response = httpClient.simpleRequest(MINIUM_URl);
        Release release = objectMapper.readValue(response, Release.class);
        return release;
    }
}
