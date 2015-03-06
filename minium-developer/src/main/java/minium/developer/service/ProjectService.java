package minium.developer.service;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import javax.servlet.http.HttpSession;

import minium.developer.project.ProjectProperties;
import minium.developer.web.rest.dto.ProjectDTO;
import minium.tools.fs.service.FileSystemService;

import org.apache.commons.io.FileUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ProjectService {
	// create a property file
	String automatorTemplateDir = "/home/raphael/workspace/templates/automator";
	String cucumberTemplateDir = "/home/raphael/workspace/templates/cucumber";

	@Autowired
	private FileSystemService fileSystemservice;

	public void createProject(ProjectProperties projectProperties, ProjectDTO project, HttpSession session) throws IOException {
		// TODO create the file structure
		// create
		createAutomatorProject(project);
		openProject(projectProperties,getPath(project),session);
	}

	public boolean isValid(String path) {
		return fileSystemservice.dirExists(path);
	}

	public String typeOfProject(String path) {
		// TODO refactor put in ENUM
		// remove hardcoded strings
		String project;
		if (isCucumberProject(path)) {
			project = "Cucumber";
		} else if (isAutomatorProject(path)) {
			project = "Automator";
		} else {
			project = "No project here";
		}

		return project;
	}

	public void openProject(ProjectProperties projectProperties, String path, HttpSession session) {
		session.invalidate();
		File f = new File(path);
		projectProperties.setDir(f);
	}

	public boolean hasProject(ProjectProperties projectProperties) {
		File dir = projectProperties.getDir();
		boolean hasProject = true;
		if (dir.getPath() == ".") {
			hasProject = false;
		}
		return hasProject;
	}

	// TODO:create a service for this methods
	protected boolean createAutomatorProject(ProjectDTO project) throws IOException {
		// create the parent folder
		String path = createParentDir(project.getDirectory(), project.getName());
		File templateDir = new File(automatorTemplateDir);
		File destDir = new File(path);
		FileUtils.copyDirectory(templateDir, destDir);
		return false;
	}

	protected String createParentDir(String directory, String projectName) throws IOException {
		File f = new File(directory, projectName);
		FileUtils.forceMkdir(f);
		return f.getPath();
	}

	/**
	 * Create a cucumber project
	 * 
	 * @param project
	 * @return
	 * @throws IOException
	 */
	protected boolean createCucumberProject(ProjectDTO project) throws IOException {
		// create the parent folder
		String path = createParentDir(project.getDirectory(), project.getName());

		File templateDir = new File(cucumberTemplateDir);
		File destDir = new File(path);
		FileUtils.copyDirectory(templateDir, destDir);
		// to change the pom.xml

		// to change the folder of src/main/groupId/
		// to change the File name of src/main/groupId/ArtifactIdIT.java

		// create the file of src/test/resources/FeatureFileName.feature
		// create the file of src/test/resources/stepFileName.js
		return true;

	}

	/**
	 * Create the structure of the file "manually"
	 * 
	 * @param project
	 * @throws IOException
	 */
	protected void createStruture(ProjectDTO project) throws IOException {
		File f = new File(project.getDirectory(), project.getName());
		// create the father folder
		FileUtils.forceMkdir(f);
		String path = f.getPath();

		// create pom.xml
		f = new File(path, "pom.xml");
		f.createNewFile();

		// create src/test/java
		f = new File(path, "src/test/java");
		FileUtils.forceMkdir(f);

		// create src/test/resources
		f = new File(path, "src/test/resources");
		FileUtils.forceMkdir(f);
		path = f.getPath();
		// create src/test/resources/config
		// create src/test/resources/features
		// create src/test/resources/modules
		// create src/test/resources/steps
		List<String> resources = new ArrayList<String>();
		resources.add("config");
		resources.add("features");
		resources.add("modules");
		resources.add("config");

		for (String folder : resources) {
			f = new File(path, folder);
			FileUtils.forceMkdir(f);
		}
	}

	protected boolean isCucumberProject(String dir) {
		// TODO for now, just checks if pom.xml exists
		return new File(dir, "pom.xml").exists();
	}

	protected boolean isAutomatorProject(String dir) {
		// TODO for now, just checks if main.js exists
		return new File(dir, "main.js").exists();
	}
	
	protected String getPath(ProjectDTO project){
		File f = new File(project.getDirectory(), project.getName());
		return f.getPath();
	}

}
