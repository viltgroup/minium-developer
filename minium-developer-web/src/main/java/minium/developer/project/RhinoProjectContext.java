package minium.developer.project;

import com.google.common.collect.Lists;

public class RhinoProjectContext extends AbstractProjectContext {

    public RhinoProjectContext(ProjectProperties projConfiguration) throws Exception {
        super(projConfiguration);
    }

    @Override
    protected void refreshAdditionalClasspath() {
        additionalClasspath = Lists.newArrayList();
    }
}
