package minium.pupino.config.visual;

import static minium.visual.VisualModules.baseModule;
import static minium.visual.VisualModules.combine;
import static minium.visual.VisualModules.debugModule;
import static minium.visual.VisualModules.interactableModule;
import static minium.visual.VisualModules.positionModule;

import java.io.IOException;

import minium.Elements;
import minium.Minium;
import minium.pupino.cucumber.JsVariable;
import minium.script.rhinojs.RhinoEngine;
import minium.script.rhinojs.RhinoProperties;
import minium.visual.CoreVisualElements.DefaultVisualElements;
import minium.visual.VisualElementsFactory;
import minium.visual.VisualModule;
import minium.visual.internal.actions.VisualDebugInteractionPerformer;

import org.sikuli.script.Screen;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.core.env.Environment;

@Profile("visual")
@Configuration
@EnableConfigurationProperties(VisualProperties.class)
public class VisualConfiguration {

    @Autowired
    @Bean
    @JsVariable("screen")
    public Screen screen(VisualProperties visualProperties, Environment env) {
        return new Screen();
    }

    @Autowired
    @Bean
    public Elements root(Screen screen) {
        VisualDebugInteractionPerformer performer = new VisualDebugInteractionPerformer();
        VisualModule visualModule = combine(
                baseModule(screen, DefaultVisualElements.class),
                positionModule(),
                interactableModule(performer),
                debugModule(performer));
        VisualElementsFactory.Builder<DefaultVisualElements> builder = new VisualElementsFactory.Builder<>();
        visualModule.configure(builder);
        DefaultVisualElements root = builder.build().createRoot();
        Minium.set(root);
        return root;
    }

    @Autowired
    @Bean
    public RhinoEngine rhinoEngine(RhinoProperties rhinoProperties, Screen screen) throws IOException {
        RhinoEngine rhinoEngine = new RhinoEngine(rhinoProperties);
        rhinoEngine.put("screen", screen);
        return rhinoEngine;
    }
}
