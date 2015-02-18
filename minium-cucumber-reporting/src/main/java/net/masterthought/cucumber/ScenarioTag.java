package net.masterthought.cucumber;

import net.masterthought.cucumber.json.Element;

import com.google.common.base.Predicate;

public class ScenarioTag {

    private Element scenario;
    private String parentFeatureUri;

    public ScenarioTag(Element scenario, String parentFeatureUri) {
        this.scenario = scenario;
        this.parentFeatureUri = parentFeatureUri;
    }

    public Element getScenario() {
        return scenario;
    }

    public String getParentFeatureUri() {
        return parentFeatureUri;
    }

    public static class predicates {

        public static Predicate<ScenarioTag> scenarioExists(final String fileUri, final String name) {
            return new Predicate<ScenarioTag>() {
                @Override
                public boolean apply(ScenarioTag scenarioTag) {
                    return scenarioTag.equals(fileUri) && scenarioTag.equals(name);
                }
            };
        }

    }

}
