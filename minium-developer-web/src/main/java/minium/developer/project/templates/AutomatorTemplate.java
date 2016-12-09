package minium.developer.project.templates;

import java.io.File;
import java.io.IOException;

import minium.developer.web.rest.dto.ProjectDTO;

import org.apache.commons.io.FileUtils;

public class AutomatorTemplate extends ProjectTemplate {

    public AutomatorTemplate(ProjectDTO project) {
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
    public void buildFiles() {
    }

    private void createStructure(String destPath) throws IOException {
        // create folder modules file in root
        File file = new File(destPath, "modules");
        FileUtils.forceMkdir(file);
        // create a file a main.js in root
        File fileModules = new File(destPath);
        copyResource("/templates/automator-project/main.js", fileModules, "main.js");
    }
}
