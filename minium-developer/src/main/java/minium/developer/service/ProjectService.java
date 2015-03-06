package minium.developer.service;

import java.io.File;

import javax.servlet.http.HttpSession;

import minium.developer.project.ProjectProperties;
import minium.developer.web.rest.dto.ProjectDTO;
import minium.tools.fs.service.FileSystemService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ProjectService {

	@Autowired
	private FileSystemService fileSystemservice;

	public void createProject(ProjectDTO project) {
		// TODO create the file structure
	}

	public boolean isValid(String path) {
		return fileSystemservice.dirExists(path);
	}

	public String typeOfProject(String path) {
		//TODO refactor put in ENUM 
		//remove hardcoded strings
		String project;
		if (isCucumberProject(path)) {
			project = "Cucumber";
		} else if (isAutomatorProject(path)) {
			project = "Automator";
		}else{
			project = "No project here";
		}
		
		return project;
	}

	public void importProject(ProjectProperties projectProperties, String path, HttpSession session) {
		session.invalidate();
		File f = new File(path);
		projectProperties.setDir(f);
	}

	protected boolean createAutomatorProject(ProjectDTO project) {
		// TODO create the file structure
		return false;

	}

	protected boolean createCucumberProject(ProjectDTO project) {
		// TODO create the file structure
		return false;

	}

	protected boolean isCucumberProject(String dir) {
		// TODO for now, just checks if pom.xml exists
		return new File(dir, "pom.xml").exists();
	}

	protected boolean isAutomatorProject(String dir) {
		// TODO for now, just checks if main.js exists
		return new File(dir, "main.js").exists();
	}

	public boolean hasProject(ProjectProperties projectProperties) {
		File dir = projectProperties.getDir();
		boolean hasProject = true;
		if(dir.getPath() == "."){
			hasProject = false;
		}
		return hasProject;
	}

}
