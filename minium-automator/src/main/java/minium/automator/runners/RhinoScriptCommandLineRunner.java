package minium.automator.runners;

import minium.automator.config.AutomatorProperties;
import minium.script.js.JsVariablePostProcessor;
import minium.script.rhinojs.RhinoEngine;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.ApplicationContext;

public class RhinoScriptCommandLineRunner implements CommandLineRunner {

    @Autowired
    private RhinoEngine rhinoEngine;
    @Autowired
    private JsVariablePostProcessor jsVariablePostProcessor;
    @Autowired
    private AutomatorProperties properties;
    @Autowired
    private ApplicationContext context;

    @Override
    public void run(String... args) throws Exception {
        jsVariablePostProcessor.populateEngine(rhinoEngine);
        if (properties.getScript() != null) {
            rhinoEngine.eval(properties.getScript(), 1);
        }
        if (properties.getFile() != null) {
            rhinoEngine.runScript(properties.getFile());
        }
    }

}
