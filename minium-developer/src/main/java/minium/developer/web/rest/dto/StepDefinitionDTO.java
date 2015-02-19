package minium.developer.web.rest.dto;

import java.io.Serializable;

import cucumber.runtime.StepDefinition;

public class StepDefinitionDTO implements Serializable {

    private static final long serialVersionUID = 440919180603075404L;

    private String pattern;
    private Integer parameterCount;
    private String location;
    private String detailedLocation;

    public StepDefinitionDTO() {
    }

    public StepDefinitionDTO(StepDefinition stepDefinition) {
        this.pattern = stepDefinition.getPattern();
        this.parameterCount = stepDefinition.getParameterCount();
        this.location = stepDefinition.getLocation(false);
        this.detailedLocation = stepDefinition.getLocation(true);
    }

    public String getPattern() {
        return pattern;
    }

    public void setPattern(String pattern) {
        this.pattern = pattern;
    }

    public Integer getParameterCount() {
        return parameterCount;
    }

    public void setParameterCount(Integer parameterCount) {
        this.parameterCount = parameterCount;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getDetailedLocation() {
        return detailedLocation;
    }

    public void setDetailedLocation(String detailedLocation) {
        this.detailedLocation = detailedLocation;
    }

}

