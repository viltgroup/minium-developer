package minium.pupino.service;

import gherkin.formatter.Formatter;
import gherkin.formatter.PrettyFormatter;
import gherkin.parser.Parser;

import java.io.File;
import java.io.IOException;
import java.io.StringWriter;

import org.apache.commons.io.FileUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.Resource;
import org.springframework.core.io.support.PathMatchingResourcePatternResolver;
import org.springframework.stereotype.Service;

@Service
public class FormatService {
	
	private static final Logger LOGGER = LoggerFactory.getLogger(FormatService.class);

	public StringWriter formatter(File file) throws IOException {

		StringWriter sw = new StringWriter();
		Formatter formatter = new PrettyFormatter(sw, true, false);
		Parser parser = new Parser(formatter);
		LOGGER.debug("Path {}", file.getAbsolutePath());
		
		String fileContent = FileUtils.readFileToString(file, "UTF-8");
		parser.parse(fileContent, file.getName(), null);
		formatter.done();
		FileUtils.write(file, sw.toString());
		
		return sw;
	}
	
	public void directoryFormatter(File file) throws IOException{
		PathMatchingResourcePatternResolver patternResolver = new PathMatchingResourcePatternResolver();
		Resource[] files = patternResolver.getResources("file://" + file.getAbsolutePath() + "/**/*.feature");
		
		for (Resource resource : files) {
			file = resource.getFile();
			LOGGER.info("Formating {}", resource.getFilename());
			this.formatter(file);
		}
	}
}
