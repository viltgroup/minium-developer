package minium.cucumber.report;

import java.util.List;
import java.util.Map;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import com.fasterxml.jackson.annotation.JsonView;
import com.google.common.collect.Lists;
import com.google.common.collect.Maps;

import minium.cucumber.report.domain.After;
import minium.cucumber.report.domain.Element;
import minium.cucumber.report.domain.Result;
import minium.cucumber.report.domain.Status;
import minium.cucumber.report.domain.Step;
import minium.cucumber.report.domain.Views;

@JsonInclude(Include.NON_NULL)
@JsonPropertyOrder({
	"line",
	"name",
	"description",
	"id",
	"after",
	"type",
	"keyword",
	"steps",
	"background",
	"scenarioOutline",
	"rowIndex",
	"result",
	"profile",
	"profilesResults" })
public class ElementReport {
	
	@JsonView(Views.Public.class)
    private Integer line;
	
	@JsonView(Views.Public.class)
    private String name;

    @JsonView(Views.Public.class)
    private String description;
    
    @JsonView(Views.Public.class)
    private String id;
    
    @JsonInclude(Include.NON_EMPTY)
    @JsonView(Views.Public.class)
    private List<After> after = Lists.newArrayList();
    
    @JsonView(Views.Public.class)
    private String type;
    
    @JsonView(Views.Public.class)
    private String keyword;
    
    @JsonView(Views.Public.class)
    private List<Step> steps = Lists.newArrayList();

	@JsonView(Views.Public.class)
    private ElementReport background;
    
    @JsonView(Views.Public.class)
    private Element scenarioOutline;

	@JsonView(Views.Public.class)
    private Integer rowIndex;
    
    @JsonView(Views.Public.class)
    private Result result;
    
    @JsonView(Views.Public.class)
    private String profile;
    
    @JsonView(Views.Public.class)
    private Map<String, Result> profilesResults = Maps.newHashMap();
    
    public ElementReport(){
	}
    
    public ElementReport(Element e) {
		this.steps = e.getSteps();
		
		this.result = new Result();
		Status status = Status.PASSED; 
		for(Step s : steps){
			this.result.increaseDuration(s.getDuration());
			if(status == Status.PASSED && s.getResult().getStatus() != Status.PASSED){
				status = s.getResult().getStatus();
			}
		}
		for(After a : e.getAfter()){
			this.result.increaseDuration(a.getResult().getDuration());
		}
		this.result.setStatus(status);
		
		this.line = e.getLine();
		this.name = e.getName();
		this.description = e.getDescription();
		this.id = e.getId();
		this.after = e.getAfter();
		this.type = e.getType();
		this.keyword = e.getKeyword();
	}
    
	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((line == null) ? 0 : line.hashCode());
		return result;
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		ElementReport other = (ElementReport) obj;
		if (line == null) {
			if (other.line != null)
				return false;
		} else if (!line.equals(other.line))
			return false;
		return true;
	}
	
	private List<After> getAfter() {
		return after;
	}
	
	public ElementReport getBackground() {
		return background;
	}
	
	@JsonInclude(Include.NON_EMPTY)
	public Map<String, Result> getProfilesResults() {
		return profilesResults;
	}
	
	public Result getResult() {
		return result;
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
	
	public List<Step> getSteps() {
		return steps;
	}
	
	public void setBackground(ElementReport background) {
		if(background == null)
			return;
		
		this.background = background;
		for(Step s : background.getSteps()){
			this.result.increaseDuration(s.getDuration());
		}
		if(background.getStatus() != Status.PASSED){
			result.setStatus(background.getStatus());
		}
	}
	
	public void setScenarioOutline(Element scenarioOutline, int rowIndex) {
		this.scenarioOutline = scenarioOutline;
		this.rowIndex = rowIndex;
	}
	
	public void setType(String type) {
		this.type = type;
	}

	public void addProfileResults(String profile, ElementReport element) {
		for (int i = 0; i < steps.size(); i++) {// assuming that the steps are in the same order in both objects
			steps.get(i).addResult(profile, element.getSteps().get(i));
		}
		profilesResults.put(profile, element.getResult());
		for(int i = 0; i < after.size(); i++){// assuming that the steps are in the same order in both objects
			after.get(i).addResult(profile, element.getAfter().get(i));
		}
		result = null;
	}
}
