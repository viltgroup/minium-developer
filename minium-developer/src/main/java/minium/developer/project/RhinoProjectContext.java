package minium.developer.project;

import java.io.File;

import org.springframework.context.ConfigurableApplicationContext;

public class RhinoProjectContext extends AbstractProjectContext {

    public RhinoProjectContext(File projectDir, ConfigurableApplicationContext applicationContext) throws Exception {
        super(projectDir, applicationContext);
    }

}
