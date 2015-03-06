package minium.developer.project;

import org.springframework.beans.factory.DisposableBean;
import org.springframework.beans.factory.annotation.Autowired;

public class Workspace implements DisposableBean {

    @Autowired
    private AbstractProjectContext activeProject;

    public Workspace(AbstractProjectContext abstractProjectContext) throws Exception {
        setActiveProject(abstractProjectContext);
    }

    public void setActiveProject(AbstractProjectContext activeProject) {
        this.activeProject = activeProject;
    }

    public AbstractProjectContext getActiveProject() {
        return activeProject;
    }

    @Override
    public void destroy() throws Exception {
        activeProject.destroy();
    }
}
