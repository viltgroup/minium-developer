package minium.developer.service;

import java.io.File;
import java.io.IOException;

import javax.servlet.http.HttpSession;

import minium.developer.project.ProjectProperties;
import minium.developer.project.templates.AutomatorTemplate;
import minium.developer.project.templates.CucumberProject;
import minium.developer.project.templates.ProjectTemplate;
import minium.developer.web.rest.dto.ProjectDTO;
import minium.tools.fs.service.FileSystemService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ProjectService {

	private static final String CUCUMBER_PROJECT = "cucumber";
	private static final String AUTOMATOR_PROJECT = "automator";

	@Autowired
	private FileSystemService fileSystemservice;

	private ProjectTemplate projectTemplate;

	public boolean createProject(ProjectProperties projectProperties, ProjectDTO project, HttpSession session) {
		boolean isCreated = false;
		// validate that the path don't exists
		if (isValid(getPath(project))) {
			// means that the directory exists
			return false;
		}
		// create
		String projectType = project.getType();
		try {
			if (projectType.equals(CUCUMBER_PROJECT)) {
				createCucumberProject(project);
			} else {
				createAutomatorProject(project);
			}
			openProject(projectProperties, getPath(project), session);
			isCreated = true;
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return isCreated;
	}

	public boolean isValid(String path) {
		return fileSystemservice.dirExists(path);
	}

	public boolean isParentValid(String path) {
		File file = new File(path);
		String parent = file.getParentFile().getAbsolutePath();
		return this.isValid(parent);
	}

	public String typeOfProject(String path) {
		// TODO refactor
		String project;
		if (isCucumberProject(path)) {
			project = CUCUMBER_PROJECT;
		} else if (isAutomatorProject(path)) {
			project = AUTOMATOR_PROJECT;
		} else {
			project = "No project here";
		}

		return project;
	}

	public boolean openProject(ProjectProperties projectProperties, String path, HttpSession session) {
		boolean validProject = false;
		session.invalidate();
		File f = new File(path);
		if (f.exists()) {
			projectProperties.setDir(f);
			validProject = true;
		}

		return validProject;

	}

	public boolean hasProject(ProjectProperties projectProperties) {
		File dir = projectProperties.getDir();
		boolean hasProject = true;
		if (dir.getPath() == ".") {
			hasProject = false;
		}
		return hasProject;
	}

	public String getProjectName(ProjectProperties projectProperties) {
		File file = projectProperties.getDir();
		String parent = file.getPath();
		String projectName = parent.substring(parent.lastIndexOf("/") + 1);
		return projectName;
	}

	/**
	 * Create an automator project
	 * 
	 * @param project
	 * @return
	 * @throws IOException
	 */
	protected boolean createAutomatorProject(ProjectDTO project) throws IOException {
		projectTemplate = new AutomatorTemplate(project);
		projectTemplate.buildProject();
		return true;
	}

	/**
	 * Create a cucumber project
	 * 
	 * @param project
	 * @return
	 * @throws IOException
	 */
	protected boolean createCucumberProject(ProjectDTO project) throws IOException {
		projectTemplate = new CucumberProject(project);
		projectTemplate.buildProject();
		return true;
	}

	protected boolean isCucumberProject(String dir) {
		// TODO for now, just checks if pom.xml exists
		return new File(dir, "pom.xml").exists();
	}

	protected boolean isAutomatorProject(String dir) {
		// TODO for now, just checks if main.js exists
		return new File(dir, "main.js").exists();
	}

	protected String getPath(ProjectDTO project) {
		File f = new File(project.getDirectory(), project.getName());
		return f.getPath();
	}

}
