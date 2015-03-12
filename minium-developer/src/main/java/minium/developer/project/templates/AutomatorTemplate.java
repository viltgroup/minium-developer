package minium.developer.project.templates;

import java.io.IOException;

import minium.developer.web.rest.dto.ProjectDTO;

public class AutomatorTemplate extends ProjectTemplate {

	protected static final String AUTOMATOR_TEMPLATE_DIR = "/home/raphael/workspace/templates/automator";

	public AutomatorTemplate(ProjectDTO project) {
		super(project);
	}

	@Override
	public void buildStructure() throws IOException {
		// create the parent folder
		createParentDir(path);
		// copy the structure of project into new project destination
		copyStructure(path,AUTOMATOR_TEMPLATE_DIR);
	}

	@Override
	public void buildFiles() {
		// TODO Auto-generated method stub
	}

}
