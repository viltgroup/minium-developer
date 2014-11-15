package minium.pupino.service;

import gherkin.formatter.Formatter;
import gherkin.formatter.PrettyFormatter;
import gherkin.parser.Parser;

import java.io.StringWriter;

import minium.pupino.domain.FileContent;

import org.apache.commons.io.FilenameUtils;
import org.springframework.stereotype.Component;

import com.google.common.base.Objects;

@Component
public class GherkinAutoFormatter implements AutoFormatter {

    @Override
    public boolean handles(FileContent fileContent) {
        String extension = FilenameUtils.getExtension(fileContent.getFileProps().getName());
        return Objects.equal("feature", extension);
    }

    @Override
    public void format(FileContent fileContent) {
        StringWriter sw = new StringWriter();
        Formatter formatter = new PrettyFormatter(sw, true, false);
        Parser parser = new Parser(formatter);
        parser.parse(fileContent.getContent(), fileContent.getFileProps().getRelativeUri().toString(), null);
        formatter.done();
        fileContent.setContent(sw.toString());
    }

}
