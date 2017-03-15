package minium.developer.internal.webelements;

import minium.web.internal.WebElementsFactory.Builder;
import minium.web.internal.WebModule;

public class SelectorGadgetWebModules {

    public static WebModule selectorGadgetModule() {
        return new WebModule() {
            @Override
            public void configure(Builder<?> builder) {
                builder
                    .withCssResources("minium/web/internal/lib/selectorgadget.min.css")
                    .withJsResources(
                            "minium/web/internal/lib/selectorgadget.min.js",
                            "minium/web/internal/lib/jquery.selectorgadget.min.js")
                    .implementingInterfaces(SelectorGadgetWebElements.class);
            }
        };
    }
}
