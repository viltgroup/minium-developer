package minium.cucumber.report.json;

import java.util.List;
import java.util.Map;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import com.fasterxml.jackson.annotation.JsonView;
import com.fasterxml.jackson.annotation.JsonInclude.Include;
import com.google.common.collect.Lists;
import com.google.common.collect.Maps;

import minium.cucumber.report.domain.After;
import minium.cucumber.report.domain.Comment;
import minium.cucumber.report.domain.Element;
import minium.cucumber.report.domain.Result;
import minium.cucumber.report.domain.Status;
import minium.cucumber.report.domain.Step;
import minium.cucumber.report.domain.Views;

@JsonInclude(Include.NON_NULL)
@JsonPropertyOrder({ "comments", "line", "name", "description", "id", "after", "type", "keyword", "steps", "background", "scenarioOutline", "rowIndex", "result", "profile", "profilesResults"})
public class ElementReport {
	
	@JsonInclude(Include.NON_EMPTY)
    @JsonView(Views.Public.class)
    private List<Comment> comments = Lists.newArrayList();
	
	@JsonView(Views.Public.class)
    private Integer line;
	
	@JsonView(Views.Public.class)
    private String name;

    @JsonView(Views.Public.class)
    private String description;
    
    @JsonView(Views.Public.class)
    private String id;
    
    @JsonView(Views.Public.class)
    private List<After> after = Lists.newArrayList();
    
    @JsonView(Views.Public.class)
    private String type;
    
    @JsonView(Views.Public.class)
    private String keyword;
    
    @JsonView(Views.Public.class)
    private List<Step> steps = Lists.newArrayList();
    
    @JsonView(Views.Public.class)
    private BackgroundReport background;
    
    @JsonView(Views.Public.class)
    private Element scenarioOutline;

	@JsonView(Views.Public.class)
    private Integer rowIndex;
    
    @JsonView(Views.Public.class)
    private Result result;
    
    @JsonView(Views.Public.class)
    private Map<String, Result> profilesResults = Maps.newHashMap();
    
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
		
		this.comments = e.getComments();
		this.line = e.getLine();
		this.name = e.getName();
		this.description = e.getDescription();
		this.id = e.getId();
		this.after = e.getAfter();
		this.type = e.getType();
		this.keyword = e.getKeyword();
	}
	
	public ElementReport(){
		
	}
	
    public Element getScenarioOutline() {
		return scenarioOutline;
	}

	public void setScenarioOutline(Element scenarioOutline, int rowIndex) {
		this.scenarioOutline = scenarioOutline;
		this.rowIndex = rowIndex;
	}

	public Integer getRowIndex() {
		return rowIndex;
	}

	public void setRowIndex(Integer rowIndex) {
		this.rowIndex = rowIndex;
	}

	public Integer getLine() {
		return line;
	}

	public void setLine(Integer line) {
		this.line = line;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public List<After> getAfter() {
		return after;
	}

	public void setAfter(List<After> after) {
		this.after = after;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public String getKeyword() {
		return keyword;
	}

	public void setKeyword(String keyword) {
		this.keyword = keyword;
	}

	public List<Step> getSteps() {
		return steps;
	}

	public void setSteps(List<Step> steps) {
		this.steps = steps;
	}

	public BackgroundReport getBackground() {
		return background;
	}

	public void setBackground(BackgroundReport background) {
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

	public Result getResult() {
		return result;
	}

	public void setResult(Result result) {
		this.result = result;
	}

	@JsonInclude(Include.NON_EMPTY)
	public Map<String, Result> getProfilesResults() {
		return profilesResults;
	}

	public void setProfilesResults(Map<String, Result> profilesResults) {
		this.profilesResults = profilesResults;
	}
}
