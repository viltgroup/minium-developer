package minium.developer.service;

import java.io.IOException;
import java.text.ParseException;

import org.springframework.stereotype.Service;

import minium.developer.utils.HttpClientUtils;
import minium.developer.web.rest.dto.VersionDTO;
import minium.developer.web.version.GitHubRelease;
import minium.developer.web.version.MiniumReleaseManager;

@Service
public class VersionService {

    private MiniumReleaseManager releaseManager;

    public VersionDTO getLocalVersionInfo() throws ParseException {
        return releaseManager.getLocalVersion();
    }

    public VersionDTO checkForNewVersion() throws IOException{
        releaseManager = new GitHubRelease(new HttpClientUtils());
        return releaseManager.gotTheLastVersion();
    }
}
