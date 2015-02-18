package net.masterthought.cucumber.json;

import java.util.ArrayList;
import java.util.List;

import net.masterthought.cucumber.ConfigurationOptions;
import net.masterthought.cucumber.util.Util;

import org.apache.commons.lang3.StringUtils;

import com.google.common.base.Function;
import com.google.common.base.Optional;
import com.google.common.collect.FluentIterable;
import com.google.common.collect.ImmutableList;

public class Element {

    private String name;
    @SuppressWarnings("unused")
    private String description;
    private String keyword;
    private Step[] steps;
    private Tag[] tags;

    public Element() {

    }

    public FluentIterable<Step> getSteps() {
        return FluentIterable.from(ImmutableList.copyOf(Optional.fromNullable(steps).or(new Step[]{})));
    }

    public FluentIterable<Tag> getTags() {
        return FluentIterable.from(ImmutableList.copyOf(Optional.fromNullable(tags).or(new Tag[]{})));
    }

    public Util.Status getStatus() {
    	// can be optimized to retrieve only the count of elements and not the all list
        int results = getSteps().filter(Step.predicates.hasStatus(Util.Status.FAILED)).size();

        if (results == 0 && ConfigurationOptions.skippedFailsBuild()) {
        	results = getSteps().filter(Step.predicates.hasStatus(Util.Status.SKIPPED)).size();
        }

        if (results == 0 && ConfigurationOptions.undefinedFailsBuild()) {
        	results = getSteps().filter(Step.predicates.hasStatus(Util.Status.UNDEFINED)).size();
        }

        return results == 0 ? Util.Status.PASSED : Util.Status.FAILED;
    }

    public String getRawName() {
        return name;
    }

    public String getKeyword() {
        return keyword;
    }

    public String getName() {
        List<String> contentString = new ArrayList<String>();

        if (Util.itemExists(keyword)) {
            contentString.add("<span class=\"scenario-keyword\">" + keyword + ": </span>");
        }

        if (Util.itemExists(name)) {
            contentString.add("<span class=\"scenario-name\">" + name + "</span>");
        }

        return Util.itemExists(contentString) ? Util.result(getStatus()) + StringUtils.join(contentString.toArray(), " ") + Util.closeDiv() : "";
    }

    public FluentIterable<String> getTagList() {
        return processTags();
    }

    public boolean hasTags() {
        return Util.itemExists(tags);
    }

    private FluentIterable<String> processTags() {
        return getTags().transform(Tag.functions.getName());
    }

    public String getTagsList() {
        String result = "<div class=\"feature-tags\"></div>";
        if (Util.itemExists(tags)) {
            String tagList = StringUtils.join(processTags().toList().toArray(), ",");
            result = "<div class=\"feature-tags\">" + tagList + "</div>";
        }
        return result;
    }

    public static class functions {
        public static Function<Element, Util.Status> status() {
            return new Function<Element, Util.Status>() {
                @Override
                public Util.Status apply(Element element) {
                    return element.getStatus();
                }
            };
        }
    }

}
