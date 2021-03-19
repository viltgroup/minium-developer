package minium.project.generator.template;

import org.apache.commons.io.FileUtils;

import java.io.File;
import java.io.IOException;

public class AutomatorProject extends ProjectTemplate {

    public AutomatorProject(ProjectDTO project) {
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
        // Do nothing
    }

    private void createStructure(String destPath) throws IOException {
        // create folder modules file in root
        File file = new File(destPath, "modules");
        FileUtils.forceMkdir(file);
        // create a file a main.js in root
        File fileModules = new File(destPath);
        copyResource("/automator-project/main.js", fileModules, "main.js");
    }
}