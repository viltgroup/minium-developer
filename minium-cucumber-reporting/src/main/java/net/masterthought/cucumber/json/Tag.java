package net.masterthought.cucumber.json;

import com.google.common.base.Function;

public class Tag {

    private String name;

    public Tag(String name) {
        this.name = name;
    }

    public String getName() {
        return name;
    }

    public static class functions {

        public static Function<Tag, String> getName() {
            return new Function<Tag, String>() {
                @Override
                public String apply(Tag tag) {
                    return tag.getName();
                }
            };
        }
    }

}
