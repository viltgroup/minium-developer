package minium.project.generator.template;

import minium.developer.web.rest.dto.ProjectDTO;

public class CucumberProject extends MavenProjectTemplate {

    public CucumberProject(ProjectDTO project) {
        super(project, WEB_APP_TESTING);
    }
}