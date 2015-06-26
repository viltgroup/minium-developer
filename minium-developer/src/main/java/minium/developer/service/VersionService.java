package minium.developer.service;

import java.io.IOException;
import java.net.JarURLConnection;
import java.net.URL;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.jar.Attributes;
import java.util.jar.Manifest;

import minium.developer.Application;
import minium.developer.web.rest.dto.VersionDTO;

import org.springframework.stereotype.Service;

import com.google.common.base.Throwables;

@Service
public class VersionService {

    public VersionDTO getVersionAndDate() throws ParseException {
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

        } catch (IOException e) {
            throw Throwables.propagate(e);
        }

        return new VersionDTO(impVersion, impBuildDate, commitHash);
    }
}
