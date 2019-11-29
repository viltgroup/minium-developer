package minium.developer.project.templates;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStreamWriter;
import java.io.Writer;
import java.util.List;
import java.util.Map;

import com.google.common.collect.Maps;
import org.apache.commons.compress.utils.Lists;
import org.apache.commons.io.FileUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.ApplicationContext;

import freemarker.template.Configuration;
import freemarker.template.Template;
import minium.developer.utils.Utils;
import minium.developer.web.rest.dto.ProjectDTO;
import minium.web.WebElements;

public class MavenProjectTemplate extends ProjectTemplate {

    private static final Logger LOGGER = LoggerFactory.getLogger(MavenProjectTemplate.class);

    private static final String APPLICATION_YML = "application.yml";
    private static final String POM_XML = "pom.xml";
    private static final String TEMPLATES_FOLDER = "templates/";

    protected static final String MONITORING = "monitoring";
    protected static final String WEB_APP_TESTING = "cucumber";

    private String templateName;

	public MavenProjectTemplate(ProjectDTO project, String templateName) {
		super(project);
		this.templateName = templateName;
	}

	@Override
	public void buildStructure() throws IOException {
		// create the parent folder
		createParentDir(path);
		// create the structure of project into new project destination
		createStructure(path);
	}

	@Override
	public void buildFiles() throws IOException {

		// change the pom.xml
		buildPom(path);

		// to change the folder of src/main/groupId/
		String mainPath = path + "/src/test/java";
		String groupId = project.getGroupId().replaceAll("\\.", "\\/");
		File f = new File(mainPath, groupId);
		FileUtils.forceMkdir(f);

		// create files related to cucumber (features and steps)
		buildCucumberFiles();

		// to change the File name of src/test/groupId/ArtifactIdIT.java
		buildTestClass(f);
	}

	private void createStructure(String destPath) throws IOException {
		File file;

		// create src/test/java
		file = new File(destPath, "src/test/java");
		FileUtils.forceMkdir(file);

		// create src/test/resources
		file = new File(destPath, "src/test/resources");
		FileUtils.forceMkdir(file);

		List<String> resourcesFolders = Lists.newArrayList();
		resourcesFolders.add("config");
		resourcesFolders.add("features");
		resourcesFolders.add("modules");
		resourcesFolders.add("steps");

		for (String folder : resourcesFolders) {
			File newFile = new File(file, folder);
			FileUtils.forceMkdir(newFile);
		}

		// copy application.yml config/application.yml
        File fileModules = new File(file, "config");
		copyResource("/" + TEMPLATES_FOLDER + this.templateName + "-project/" + APPLICATION_YML, fileModules, APPLICATION_YML);
	}

	private void buildPom(String path) {
		File newFile = new File(path, POM_XML);

		Configuration cfg = new Configuration(Configuration.DEFAULT_INCOMPATIBLE_IMPROVEMENTS);
		cfg.setClassForTemplateLoading(this.getClass(), "/");
		try {
			// Load the template
			Template template = cfg.getTemplate(TEMPLATES_FOLDER + this.templateName + "-project/pom.ftl");

			Map<String, Object> data = Maps.newHashMap();
			data.put("groupId", project.getGroupId());
			data.put("artifactId", project.getArtifactId());
			data.put("version", project.getVersion());

			//minium version
			String miniumVersionStr = WebElements.class.getPackage().getImplementationVersion();
			String miniumVersion = miniumVersionStr != null ? miniumVersionStr : "1.1.0-SNAPSHOT" ;
			data.put("miniumVersion", miniumVersion);

			//spring version
			String springVersion = ApplicationContext.class.getPackage().getImplementationVersion();
			data.put("springVersion", springVersion);

			try (Writer out = new OutputStreamWriter(new FileOutputStream(newFile))) {
			    template.process(data, out);
			    out.flush();
			}
		} catch (Exception e) {
	         LOGGER.debug("Error occurred when generating {}", newFile, e);
		}
	}

	private void buildTestClass(File f) {
		String className = Utils.toClassName(project.getArtifactId()) + "IT";
		String fileName = className + ".java";

		File newFile = new File(f, fileName);
		Configuration cfg = new Configuration(Configuration.DEFAULT_INCOMPATIBLE_IMPROVEMENTS);
		cfg.setClassForTemplateLoading(this.getClass(), "/");
		try {
			// Load the template
			Template template = cfg.getTemplate(TEMPLATES_FOLDER + this.templateName + "-project/test-class.ftl");

			Map<String, Object> data = Maps.newHashMap();
			data.put("groupId", project.getGroupId());
            data.put("className", className);

            try (Writer out = new OutputStreamWriter(new FileOutputStream(newFile))) {
                template.process(data, out);
                out.flush();
            }
		} catch (Exception e) {
		    LOGGER.debug("Error occurred when generating {}", newFile, e);
		}
	}

    protected void buildCucumberFiles() throws IOException {
		// src/test/resources/features/FeatureFileName.feature
		String resourcesPath = path + "/src/test/resources/";
		File f = new File(resourcesPath, "features");
		File fileModules = new File(f, "");
		copyResource("/" + TEMPLATES_FOLDER + this.templateName + "-project/Feature.feature", fileModules, project.getFeatureFile() + ".feature");

		// create the file of src/test/resources/stepFileName.js
		f = new File(resourcesPath, "steps");
		fileModules = new File(f, "");
		copyResource("/" + TEMPLATES_FOLDER + this.templateName + "-project/steps.js", fileModules, project.getStepFile() + ".js");
		copyResource("/" + TEMPLATES_FOLDER + this.templateName + "-project/world.js", fileModules, "world.js");
	}
}
