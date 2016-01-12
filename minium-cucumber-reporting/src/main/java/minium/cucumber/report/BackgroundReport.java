package minium.cucumber.report;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import com.fasterxml.jackson.annotation.JsonView;
import com.fasterxml.jackson.annotation.JsonInclude.Include;
import com.google.common.collect.Lists;

import minium.cucumber.report.domain.Element;
import minium.cucumber.report.domain.Status;
import minium.cucumber.report.domain.Step;
import minium.cucumber.report.domain.Views;

@JsonInclude(Include.NON_NULL)
@JsonPropertyOrder({
	"line",
	"name",
	"description",
	"keyword",
	"steps"})
public class BackgroundReport {

	@JsonView(Views.Public.class)
    private Integer line;
	
	@JsonView(Views.Public.class)
    private String name;

    @JsonView(Views.Public.class)
    private String description;
    
    @JsonView(Views.Public.class)
    private String keyword;
    
    @JsonView(Views.Public.class)
    private List<Step> steps = Lists.newArrayList();
    
    public BackgroundReport(){
	}

	public BackgroundReport(Element e) {
		this.line = e.getSteps().get(0).getLine() - 1;
		this.name = e.getName();
		this.description = e.getDescription();
		this.keyword = "Background";
		this.steps = e.getSteps();
	}

	public List<Step> getSteps() {
		return steps;
	}
	
	@JsonIgnore
    public Status getStatus() {
        for (Step step : steps) {
            if (step.getStatus() != Status.PASSED) {
            	return step.getStatus();
            }
        }
        return Status.PASSED;
    }
	
}
