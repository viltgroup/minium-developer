package minium.developer.project;

import com.google.common.base.Preconditions;

import java.io.File;

public class ProjectProperties {

    private File dir = new File(".");
    private File resourcesDir;

    ProjectProperties() { }

    public ProjectProperties(File dir) {
        this.dir = dir;
    }

    public void setDir(File dir) {
        this.dir = dir;
    }

    public File getDir() {
        return Preconditions.checkNotNull(dir);
    }

    public void setResourcesDir(File resourcesDir) {
        this.resourcesDir = resourcesDir;
    }

    public File getResourcesDir() {
        return resourcesDir == null && isCucumberProject() ? new File(dir, "src/test/resources") : dir;
    }

    public String getProjectName() {
        return dir.getName();
    }

    public boolean isCucumberProject() {
        // TODO for now, just checks if pom.xml exists
        return new File(dir, "pom.xml").exists();
    }

    public boolean isAutomatorProject() {
        // TODO for now, just checks if main.js exists
        return new File(dir, "main.js").exists();
    }

    public boolean isValidProject() {
        return this.dir != null;
    }
}
