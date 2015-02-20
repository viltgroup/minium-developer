package minium.developer.project;

import java.io.File;

public class ProjectProperties {

    private File dir;
    private File resourcesDir;

    public void setDir(File dir) {
        this.dir = dir;
    }

    public File getDir() {
        return dir;
    }

    public void setResourcesDir(File resourcesDir) {
        this.resourcesDir = resourcesDir;
    }

    public File getResourcesDir() {
        return resourcesDir == null && isCucumberProject() ? new File(dir, "src/test/resources") : dir;
    }

    public boolean isCucumberProject() {
        // TODO for now, just checks if pom.xml exists
        return new File(dir, "pom.xml").exists();
    }
}
