package minium.developer.project;

import java.io.File;

public class RhinoProjectContext extends AbstractProjectContext {

    public RhinoProjectContext(File projectDir) throws Exception {
        super(projectDir, projectDir);
    }

}
