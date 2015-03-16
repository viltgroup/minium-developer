package minium.developer.project.templates;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStreamWriter;
import java.io.Writer;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import minium.developer.utils.Utils;
import minium.developer.web.rest.dto.ProjectDTO;
import minium.web.WebElements;

import org.apache.commons.io.FileUtils;
import org.springframework.context.ApplicationContext;

import freemarker.template.Configuration;
import freemarker.template.Template;
import freemarker.template.TemplateException;

public class CucumberProject extends ProjectTemplate {

	private static final String UTILS_JS = "utils.js";
	private static final String LODASH_JS = "lodash.js";
	private static final String APPLICATION_YML = "application.yml";
	private static final String LOGBACK_XML = "logback.xml";
	private static final String POM_XML = "pom.xml";

	public CucumberProject(ProjectDTO project) {
		super(project);
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

		List<String> resourcesFolders = new ArrayList<String>();
		resourcesFolders.add("config");
		resourcesFolders.add("features");
		resourcesFolders.add("modules");
		resourcesFolders.add("steps");

		for (String folder : resourcesFolders) {
			File newFile = new File(file, folder);
			FileUtils.forceMkdir(newFile);
		}

		// copy logback.xml into "src/test/resources"
		File fileModules = new File(file, "");
		copyResource("/templates/cucumber-project/" + LOGBACK_XML, fileModules, LOGBACK_XML);

		// copy application.yml config/application.yml
		fileModules = new File(file, "config");
		copyResource("/templates/cucumber-project/" + APPLICATION_YML, fileModules, APPLICATION_YML);

		// copy the file modules/cucumber/utils.js
		fileModules = new File(file, "modules");
		copyResource("/templates/cucumber-project/modules/" + LODASH_JS, fileModules, LODASH_JS);

		// create the modules/cucumber folder
		fileModules = new File(file, "modules/cucumber");
		FileUtils.forceMkdir(fileModules);
		// copy the file modules/cucumber/utils.js
		copyResource("/templates/cucumber-project/modules/cucumber/" + UTILS_JS, fileModules, UTILS_JS);

	}

	private void buildPom(String path) {
		File newFile = new File(path, POM_XML);

		@SuppressWarnings("deprecation")
		Configuration cfg = new Configuration();
		cfg.setClassForTemplateLoading(this.getClass(), "/");
		try {
			// Load the template
			Template template = cfg.getTemplate("templates/cucumber-project/pom.ftl");

			Map<String, Object> data = new HashMap<String, Object>();
			data.put("groupId", project.getGroupId());
			data.put("artifactId", project.getArtifactId());
			data.put("version", project.getVersion());
			
			//minium version
			String tmp = WebElements.class.getPackage().getImplementationVersion();
			String miniumVersion = tmp != null ? tmp : "1.0.0-SNAPSHOT" ;
			data.put("miniumVersion", miniumVersion);
			
			//spring version
			String springVersion = ApplicationContext.class.getPackage().getImplementationVersion();
			data.put("springVersion", springVersion);

			Writer out = new OutputStreamWriter(new FileOutputStream(newFile));
			template.process(data, out);
			out.flush();
		} catch (IOException e) {
			e.printStackTrace();
		} catch (TemplateException e) {
			e.printStackTrace();
		}
	}

	private void buildTestClass(File f) {
		
		String className = Utils.toClassName(project.getArtifactId()) + "IT";
		String fileName = className + ".java";

		File newFile = new File(f, fileName);
		@SuppressWarnings("deprecation")
		Configuration cfg = new Configuration();
		cfg.setClassForTemplateLoading(this.getClass(), "/");
		try {
			// Load the template
			Template template = cfg.getTemplate("templates/cucumber-project/test-class.ftl");

			Map<String, Object> data = new HashMap<String, Object>();
			data.put("groupId", project.getGroupId());
			data.put("className", className);

			Writer out = new OutputStreamWriter(new FileOutputStream(newFile));
			template.process(data, out);
			out.flush();
		} catch (IOException e) {
			e.printStackTrace();
		} catch (TemplateException e) {
			e.printStackTrace();
		}
	}

	private void buildCucumberFiles() throws IOException {
		// src/test/resources/features/FeatureFileName.feature
		String resourcesPath = path + "/src/test/resources/";
		File f = new File(resourcesPath, "features");
		File fileModules = new File(f, "");
		copyResource("/templates/cucumber-project/Feature.feature", fileModules, project.getFeatureFile() + ".feature");

		// create the file of src/test/resources/stepFileName.js
		f = new File(resourcesPath, "steps");
		fileModules = new File(f, "");
		copyResource("/templates/cucumber-project/steps.js", fileModules, project.getStepFile() + ".js");
	}

}
