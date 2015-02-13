package minium.developer.project;

import java.io.File;

import minium.web.config.services.DriverServicesProperties;

import org.springframework.context.ConfigurableApplicationContext;

public class RhinoProjectContext extends AbstractProjectContext {

    public RhinoProjectContext(DriverServicesProperties driverServices, File projectDir, ConfigurableApplicationContext applicationContext) throws Exception {
        super(driverServices, projectDir, applicationContext);
    }

}
