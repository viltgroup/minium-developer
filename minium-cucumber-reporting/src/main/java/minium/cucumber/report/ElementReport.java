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
	"id",
	"name",
	"description",
	"type",
	"keyword",
	"line",
	"rowIndex",
	"profilesResults",
	"background",
	"steps",
	"after" })
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
    private Integer rowIndex;
    
    @JsonView(Views.Public.class)
    private Result result;
    
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
	
	public void setRowIndex(int rowIndex) {
		this.rowIndex = rowIndex;
	}
	
	public void setType(String type) {
		this.type = type;
	}

	public void combineElement(String profile, ElementReport element) {
		if (background != null){
			background.combineElement(profile, element.getBackground());
		}
		for (Step step : steps) {
			step.combineStep(profile, element.getStep(step));
		}
		profilesResults.put(profile, element.getResult());
		for(After a : after){
			a.combineAfter(profile, element.getAfter(a));
		}
		result = null;
	}

	public After getAfter(After a) {
		return after.get(after.indexOf(a));
	}

	public Step getStep(Step step) {
		return steps.get(steps.indexOf(step));
	}
	
	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((description == null) ? 0 : description.hashCode());
		result = prime * result + ((id == null) ? 0 : id.hashCode());
		result = prime * result + ((keyword == null) ? 0 : keyword.hashCode());
		result = prime * result + ((line == null) ? 0 : line.hashCode());
		result = prime * result + ((name == null) ? 0 : name.hashCode());
		result = prime * result + ((type == null) ? 0 : type.hashCode());
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
		if (description == null) {
			if (other.description != null)
				return false;
		} else if (!description.equals(other.description))
			return false;
		if (id == null) {
			if (other.id != null)
				return false;
		} else if (!id.equals(other.id))
			return false;
		if (keyword == null) {
			if (other.keyword != null)
				return false;
		} else if (!keyword.equals(other.keyword))
			return false;
		if (line == null) {
			if (other.line != null)
				return false;
		} else if (!line.equals(other.line))
			return false;
		if (name == null) {
			if (other.name != null)
				return false;
		} else if (!name.equals(other.name))
			return false;
		if (type == null) {
			if (other.type != null)
				return false;
		} else if (!type.equals(other.type))
			return false;
		return true;
	}
}
