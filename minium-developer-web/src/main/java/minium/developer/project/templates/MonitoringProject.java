package minium.developer.project.templates;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStreamWriter;
import java.io.Writer;
import java.util.HashMap;
import java.util.Map;

import org.apache.commons.io.FileUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import freemarker.template.Configuration;
import freemarker.template.Template;
import minium.developer.utils.Utils;
import minium.developer.web.rest.dto.ProjectDTO;

public class MonitoringProject extends MavenProjectTemplate {

	private static final Logger LOGGER = LoggerFactory.getLogger(MonitoringProject.class);

	public MonitoringProject(ProjectDTO project) {
        super(project, "monitoring");
	}

	@Override
	public void buildFiles() throws IOException {
		// Create ExecutorTest
		createExecutorClass();
		// create AssemblyFile
		createAssemblyFile();

		super.buildFiles();
	}

	private void createExecutorClass() throws IOException {
		File f = new File(path + "/src/main/java");
		FileUtils.forceMkdir(f);

		File newFile = new File(f, "ExecutorTest.java");

		@SuppressWarnings("deprecation")
		Configuration cfg = new Configuration();
		cfg.setClassForTemplateLoading(this.getClass(), "/");
		try {
			// Load the template
            Template template = cfg.getTemplate("templates/monitoring-project/ExecutorTest.ftl");

			Map<String, Object> data = new HashMap<String, Object>();
			data.put("className", project.getGroupId() + "." + Utils.toClassName(project.getArtifactId()) + "IT");

			try (Writer out = new OutputStreamWriter(new FileOutputStream(newFile))) {
				template.process(data, out);
				out.flush();
			}
		} catch (Exception e) {
			LOGGER.debug("Error occurred when generating {}", newFile, e);
		}
	}

	private void createAssemblyFile() throws IOException {
		File f = new File(path + "/src/main/assembly");
		FileUtils.forceMkdir(f);
        copyResource("/templates/monitoring-project/assembly.xml", f, "assembly.xml");
	}

    protected void buildCucumberFiles() throws IOException {
        File f = new File(path + "/src/test/resources/steps");
        copyResource("/templates/monitoring-project/after.js", f, "after.js");

        f = new File(path + "/src/test/resources/modules");
        copyResource("/templates/monitoring-project/performance.js", f, "performance.js");
        super.buildCucumberFiles();
    }
}