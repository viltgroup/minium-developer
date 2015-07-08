package minium.developer.web.version;

import java.io.IOException;

import minium.developer.utils.HttpClientUtils;


public class MiniumIoRelease extends MiniumReleaseManager{

    protected static final String MINIUM_URl = "http://styx/minium-io/last-version.json";


    public MiniumIoRelease(HttpClientUtils httpClient) {
        super(httpClient);
    }

    @Override
    public boolean gotTheLastVersion() throws IOException{
        Release lastRelease = getLastRelease();
        Release localVersionRelease = toGitHubRelease(localVersion);
        int compare = releaseComparator.compare(localVersionRelease, lastRelease);
        return compare == 1 ? false : true;
    }

    @Override
    public Release getLastRelease() throws IOException{
        String response = httpClient.simpleRequest(MINIUM_URl);
        Release release = objectMapper.readValue(response, Release.class);
        return release;
    }
}
