package minium.developer.web.rest;

import java.io.IOException;

import javax.servlet.http.HttpSession;

import minium.developer.project.ProjectProperties;
import minium.developer.service.ProjectService;
import minium.developer.web.rest.dto.ProjectDTO;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
@RequestMapping("/app/rest")
public class ProjectResource {

	@Autowired
	private ProjectService projectService;

	@Autowired
	private ProjectProperties projectProperties;

	@RequestMapping(value = "/project/new", method = RequestMethod.POST)
	@ResponseBody
	public boolean create(@RequestBody ProjectDTO project, HttpSession session) throws Exception {
		boolean isCreated = projectService.createProject(projectProperties, project, session);
		return isCreated;
	}

	@RequestMapping(value = "/project/valid", method = RequestMethod.POST, produces = "text/plain; charset=utf-8")
	@ResponseBody
	public ResponseEntity<String> isValid(@RequestBody String path) throws IOException, InterruptedException {
		Boolean isValidDir = projectService.isValid(path);
		String typeProject = "Not valid";
		if (isValidDir) {
			typeProject = projectService.typeOfProject(path);
		}
		return new ResponseEntity<String>(typeProject, HttpStatus.OK);
	}

	@RequestMapping(value = "/project/valid/name", method = RequestMethod.POST, produces = "text/plain; charset=utf-8")
	@ResponseBody
	public ResponseEntity<String> isValidName(@RequestBody String path) throws IOException, InterruptedException {
		Boolean isValidDir = projectService.isParentValid(path);
		String typeProject = "Not valid";
		if (isValidDir) {
			isValidDir = projectService.isValid(path);
			if(isValidDir == true){
				typeProject = projectService.typeOfProject(path);
			}else{
				typeProject = projectService.typeOfProject(path);
			}
		}
		return new ResponseEntity<String>(typeProject, HttpStatus.OK);
	}

	@RequestMapping(value = "/project/import", method = RequestMethod.POST, produces = "text/plain; charset=utf-8")
	@ResponseBody
	public ResponseEntity<String> importProject(@RequestBody String path, HttpSession session) throws IOException {
		boolean validProject = projectService.openProject(projectProperties, path, session);
		if( validProject == true)
			return new ResponseEntity<String>("Ok", HttpStatus.OK);
		else
			return new ResponseEntity<String>("Project directory not valid", HttpStatus.PRECONDITION_FAILED);
	}

	@RequestMapping(value = "/project/hasProject", method = RequestMethod.GET, produces = "text/plain; charset=utf-8")
	@ResponseBody
	public String hasProject() throws IOException {
		boolean hasProject = projectService.hasProject(projectProperties);
		String projectName = "";
		if (hasProject) {
			projectName = projectService.getProjectName(projectProperties);
		}
		return projectName;
	}

}
