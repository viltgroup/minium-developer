package minium.developer.service;

import java.io.IOException;
import java.text.ParseException;

import minium.developer.utils.HttpClientUtils;
import minium.developer.web.rest.dto.VersionDTO;
import minium.developer.web.version.MiniumIoRelease;
import minium.developer.web.version.MiniumReleaseManager;

import org.springframework.stereotype.Service;

@Service
public class VersionService {

    private MiniumReleaseManager releaseManager;

    public VersionDTO getVersionAndDate() throws ParseException {
        return releaseManager.getLocalVersion();
    }

    public boolean checkForNewVersion() throws IOException{
        releaseManager = new MiniumIoRelease(new HttpClientUtils());
        return releaseManager.gotTheLastVersion();
    }
}
