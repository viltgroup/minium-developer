package minium.pupino.web.rest;

import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import minium.pupino.service.FormatService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.google.common.collect.Lists;

@RestController
@RequestMapping("/app/rest/format")
@ConfigurationProperties(prefix = "format", locations = "classpath:pupino.yml", ignoreUnknownFields = false)
public class FormatResource {

	public static class AutocompletionRequest {
		public List<String> patterns;
		public String text;
	}

	@Autowired
	private FormatService formatService;

	File baseDir;

	public void setBaseDir(File baseDir) {
		this.baseDir = baseDir;
	}

	@RequestMapping(value = "/**", method = RequestMethod.POST)
	public ResponseEntity<String> format(@RequestBody String path) throws IOException {
		File file = getFile(path);
		formatService.formatter(file);
		return new ResponseEntity<String>(file.getAbsolutePath(), HttpStatus.OK);
	}

	@RequestMapping(value = "/**", params = "action=directory", method = RequestMethod.POST)
	public ResponseEntity<String> formatDirectory(@RequestBody String path) throws IOException {
		File file = getFile(path);
		formatService.directoryFormatter(file);
		return new ResponseEntity<String>("OK", HttpStatus.OK);
	}

	@RequestMapping(value = "/autocomplete", method = RequestMethod.POST)
	@ResponseBody
	public List<String> autocompletions(@RequestBody AutocompletionRequest request) throws IOException {
		List<String> results = Lists.newArrayList();
		for (String pattern : request.patterns) {
			if (isPartialMatch(pattern, request.text))
				results.add(pattern);
		}
		return results;
	}

	// https://github.com/cucumber/gherkin-editor/blob/master/public/applet/gherkin/editor/PartialMatch.java
	public static boolean isPartialMatch(String regexp, String text) {
		Pattern p = Pattern.compile(regexp);
		Matcher m = p.matcher(text);
		return m.matches() || m.hitEnd();
	}

	protected File getFile(String path) throws IOException {
		String base = "/home/raphael/workspace/mpay/mpay-tests/mpay-e2e-tests/mpay-e2e-cgd-tests/src/test/resources";
		return new File(base, path);
	}

}
