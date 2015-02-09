package minium.developer.internal.webelements;

import minium.web.WebElementsFactory.Builder;
import minium.web.WebModule;

public class SelectorGadgetWebModules {

    public static WebModule selectorGadgetModule() {
        return new WebModule() {
            @Override
            public void configure(Builder<?> builder) {
                builder
                    .withCssResources("minium/developer/internal/webelements/lib/selectorgadget_combined.css")
                    .withJsResources(
                            "minium/developer/internal/webelements/lib/selectorgadget_combined.js",
                            "minium/developer/internal/webelements/lib/selectorgadget_minium.js")
                    .implementingInterfaces(SelectorGadgetWebElements.class);
            }
        };
    }
}
