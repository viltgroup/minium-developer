package minium.automator.runners;

import minium.automator.config.AutomatorProperties;
import minium.script.js.JsBrowserFactory;
import minium.script.js.MiniumJsEngineAdapter;
import minium.script.rhinojs.RhinoEngine;
import minium.web.CoreWebElements.DefaultWebElements;
import minium.web.actions.Browser;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;

public class RhinoScriptCommandLineRunner implements CommandLineRunner {

    @Autowired
    private RhinoEngine rhinoEngine;
    @Autowired
    private AutomatorProperties properties;
    @Autowired
    private Browser<DefaultWebElements> browser;
    @Autowired
    private JsBrowserFactory factory;

    @Override
    public void run(String... args) throws Exception {
        new MiniumJsEngineAdapter(browser, factory).adapt(rhinoEngine);
        if (properties.getScript() != null) {
            rhinoEngine.eval(properties.getScript(), 1);
        }
        if (properties.getFile() != null) {
            rhinoEngine.runScript(properties.getFile());
        }
    }

}
