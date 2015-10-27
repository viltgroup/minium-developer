package minium.developer.service;

import gherkin.formatter.Formatter;
import gherkin.formatter.PrettyFormatter;
import gherkin.parser.Parser;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.StringWriter;
import java.util.Collections;
import java.util.List;

import minium.cucumber.StringResource;
import minium.cucumber.data.MiniumFeatureBuilder;
import minium.tools.fs.service.FileSystemService;

import org.apache.commons.io.FileUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.core.io.support.PathMatchingResourcePatternResolver;
import org.springframework.stereotype.Service;

import com.google.common.base.Throwables;
import com.google.common.collect.Lists;

import cucumber.runtime.model.CucumberFeature;

@Service
public class FormatService {

    @Autowired
    private FileSystemService fileSystemService;

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

    public void directoryFormatter(File file) throws IOException {
        PathMatchingResourcePatternResolver patternResolver = new PathMatchingResourcePatternResolver();
        Resource[] files = patternResolver.getResources("file://" + file.getAbsolutePath() + "/**/*.feature");

        for (Resource resource : files) {
            file = resource.getFile();
            LOGGER.info("Formating {}", resource.getFilename());
            this.formatter(file);
        }
    }

    public String validateFeature(String featurePath) {
        try {
            FileSystemResource fileSystemResource = fileSystemService.get(featurePath);
            InputStream inputStream = new FileInputStream(fileSystemResource.getPath());
            StringResource resource = new StringResource(fileSystemResource.getPath(), inputStream);

            List<CucumberFeature> cucumberFeatures = Lists.newArrayList();
            StringWriter writer = new StringWriter();
            final PrettyFormatter formatter = new PrettyFormatter(writer, true, false);
            MiniumFeatureBuilder builder = new MiniumFeatureBuilder(cucumberFeatures, formatter, fileSystemService.getBaseDir());
            builder.parse(resource, Collections.emptyList());
            String string = writer.toString();
            return string;
        } catch (Exception e) {
            throw Throwables.propagate(e);
        }

    }

}
