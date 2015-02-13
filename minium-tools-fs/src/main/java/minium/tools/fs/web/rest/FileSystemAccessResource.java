package minium.tools.fs.web.rest;

import java.io.IOException;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Set;

import minium.tools.fs.domain.AutoFormatter;
import minium.tools.fs.domain.FileContent;
import minium.tools.fs.domain.FileProps;
import minium.tools.fs.service.FileSystemService;
import minium.tools.fs.web.method.support.AntPath;
import minium.tools.fs.web.method.support.BaseURL;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.annotation.SendToUser;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.google.common.collect.Lists;

@Controller
@RequestMapping("/app/rest/fs")
public class FileSystemAccessResource {

    @Autowired(required = false)
    private List<AutoFormatter> autoFormatters = Lists.newArrayList();

    @Autowired
    private FileSystemService service;

    @RequestMapping(value = "/**", params = "action=props", method = RequestMethod.GET)
    @ResponseBody
    public FileProps getFileProps(@BaseURL String baseUrl, @AntPath("path") String path) throws IOException {
        return service.getFileProps(baseUrl, path);
    }

    @RequestMapping(value = "/**", params = "action=list", method = RequestMethod.GET)
    @ResponseBody
    public Set<FileProps> list(@BaseURL String baseUrl, @AntPath("path") String path) throws IOException {
        return service.list(baseUrl, path);
    }

    @RequestMapping(value = "/**", method = RequestMethod.GET)
    @ResponseBody
    public FileContent getFileContent(@BaseURL String baseUrl, @AntPath("path") String path) throws IOException, URISyntaxException {
        return service.getFileContent(baseUrl, path);
    }

    @RequestMapping(value = "/new", method = RequestMethod.POST, produces = "text/plain; charset=utf-8")
    @ResponseBody
    public ResponseEntity<String> create(@BaseURL String baseUrl, @RequestBody String path) throws IOException, URISyntaxException {
        return service.create(baseUrl, path);
    }

    @RequestMapping(value = "/**", method = RequestMethod.DELETE)
    @ResponseBody
    public void delete(@AntPath("path") String path) throws IOException {
        service.delete(path);
    }

    @RequestMapping(value = "/**", method = RequestMethod.POST)
    @ResponseBody
    public FileContent save(@BaseURL String baseUrl, @RequestBody FileContent fileContent) throws IOException {
        return service.save(baseUrl, fileContent);
    }

    @RequestMapping(value = "/**", params = { "action=search", "q" }, method = RequestMethod.GET)
    @ResponseBody
    public Set<FileProps> search(@BaseURL String baseUrl, @AntPath("path") String path, @RequestParam("q") String query) throws IOException {
        return service.search(baseUrl, path, query);
    }

    @SendToUser("/queue/errors")
    public String handleException(Throwable exception) {
    	return exception.getMessage();
    }
}
