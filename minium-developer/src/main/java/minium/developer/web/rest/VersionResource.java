package minium.developer.web.rest;

import java.io.IOException;
import java.text.ParseException;

import minium.developer.service.VersionService;
import minium.developer.web.rest.dto.VersionDTO;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
@RequestMapping("/app")
public class VersionResource {

    @Autowired
    private VersionService versionService;

    @RequestMapping(value = "/rest/version", method = RequestMethod.GET)
    @ResponseBody
    public VersionDTO getVersion() throws IOException, ParseException {
         VersionDTO versionAndDate = versionService.getLocalVersionInfo();
         return versionAndDate;
    }

    @RequestMapping(value = "/rest/version/new", method = RequestMethod.GET)
    @ResponseBody
    public VersionDTO checkForNewVersion() throws IOException, ParseException {
        return versionService.checkForNewVersion();
    }
}
