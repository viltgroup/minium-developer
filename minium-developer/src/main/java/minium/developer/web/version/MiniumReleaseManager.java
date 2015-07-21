package minium.developer.web.version;

import java.io.IOException;
import java.net.JarURLConnection;
import java.net.URL;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.jar.Attributes;
import java.util.jar.Manifest;

import minium.developer.Application;
import minium.developer.utils.HttpClientUtils;
import minium.developer.web.rest.dto.VersionDTO;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.common.base.Throwables;

public abstract class MiniumReleaseManager {

    protected final HttpClientUtils httpClient;
    protected final ObjectMapper objectMapper;
    protected VersionDTO localVersion;
    protected ReleaseComparator releaseComparator;

    public MiniumReleaseManager(HttpClientUtils httpClient) {
        this.httpClient = httpClient;
        objectMapper = new ObjectMapper();
        localVersion = getLocalVersion();
        releaseComparator = new ReleaseComparator();
    }

    public Release toGitHubRelease(VersionDTO actualVersion){
        return new Release(actualVersion.getVersion(),"");
    }

    public abstract boolean gotTheLastVersion() throws IOException;

    public abstract Release getLastRelease() throws IOException;

    public VersionDTO getLocalVersion(){
        String path = Application.class.getProtectionDomain().getCodeSource().getLocation().getPath();
        String impVersion = null, impBuildDate = null, commitHash = null, url = null;

        path = path.replace("classes/", "");

        //check if the path already has the complete path of the jar
        if (path.contains(".jar")) {
            url = "jar:file:" + path + "!/";
        } else {
            url = "jar:file:" + path + "minium-developer.jar!/";
        }

        URL jarUrl = null;
        try {
            jarUrl = new URL(url);
            JarURLConnection jarConnection = null;

            jarConnection = (JarURLConnection) jarUrl.openConnection();
            Manifest manifest = jarConnection.getManifest();
            Attributes manifestItem = manifest.getMainAttributes();

            // get values and parse from manifest
            String buildTime = manifestItem.getValue("Build-Time");
            Date buildTimeDate = new SimpleDateFormat("yyyyMMddHHmmss").parse(buildTime);
            impBuildDate = new SimpleDateFormat("dd-MM-yyyy").format(buildTimeDate);
            impVersion = manifestItem.getValue("Implementation-Version");
            commitHash = manifestItem.getValue("Implementation-Build");

        } catch (IOException | ParseException e) {
            throw Throwables.propagate(e);
        }
        return new VersionDTO(impVersion, impBuildDate, commitHash);
    }
}
