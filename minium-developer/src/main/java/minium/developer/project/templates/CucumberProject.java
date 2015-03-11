package minium.developer.project.templates;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStreamWriter;
import java.io.Writer;
import java.util.HashMap;
import java.util.Map;

import minium.developer.web.rest.dto.ProjectDTO;

import org.apache.commons.io.FileUtils;

import freemarker.template.Configuration;
import freemarker.template.Template;
import freemarker.template.TemplateException;

public class CucumberProject extends ProjectTemplate {
	
	protected static final String CUCUMBER_TEMPLATE_DIR = "/home/raphael/workspace/templates/cucumber";
	
	public CucumberProject(ProjectDTO project) {
		super(project);
	}

	@Override
	public void buildStructure() throws IOException {
		// create the parent folder
		createParentDir(path);
		//copy the structure of project into new project destination
		copyStructure(path,CUCUMBER_TEMPLATE_DIR);

	}

	private void buildTestClass(File f) {
		String className = Character.toUpperCase(project.getArtifactId().charAt(0)) + project.getArtifactId().substring(1) + "TestIT";
		String fileName = className + ".java";
		
		File newFile = new File(f, fileName);
		@SuppressWarnings("deprecation")
		Configuration cfg = new Configuration();
		try {
			// Load the template
			Template template = cfg.getTemplate("src/main/resources/templates/cucumberProject/test-class.ftl");

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

	private void buildPom(String path) {
		File newFile = new File(path, "pom.xml");
		@SuppressWarnings("deprecation")
		Configuration cfg = new Configuration();
		try {
			// Load the template
			Template template = cfg.getTemplate("src/main/resources/templates/cucumberProject/pom.ftl");

			Map<String, Object> data = new HashMap<String, Object>();
			data.put("groupId", project.getGroupId());
			data.put("artifactId", project.getArtifactId());
			data.put("version", project.getVersion());

			Writer out = new OutputStreamWriter(new FileOutputStream(newFile));
			template.process(data, out);
			out.flush();
		} catch (IOException e) {
			e.printStackTrace();
		} catch (TemplateException e) {
			e.printStackTrace();
		}
	}

	@Override
	public void buildFiles() throws IOException {
		File newFile;
		//change the pom.xml
		buildPom(path);
		// to change the folder of src/main/groupId/
		String mainPath = path + "/src/test/java";
		String groupId = project.getGroupId().replaceAll("\\.", "\\/");
		File f = new File(mainPath, groupId);
		FileUtils.forceMkdir(f);
		// to change the File name of src/main/groupId/ArtifactIdIT.java
		buildTestClass(f);
		
		// src/test/resources/features/FeatureFileName.feature
		String resourcesPath = path + "/src/test/resources/";
		f = new File(resourcesPath, "features");
		newFile = new File(f, project.getFeatureFile() + ".feature");
		newFile.createNewFile();
		// create the file of src/test/resources/stepFileName.js
		f = new File(resourcesPath, "steps");
		newFile = new File(f, project.getStepFile() + ".js");
		newFile.createNewFile();
	}

}
