package minium.developer.internal.webelements;

import minium.web.internal.WebModule;
import minium.web.internal.WebElementsFactory.Builder;

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
