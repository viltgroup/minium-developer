package minium.cucumber.report.json;

import java.util.List;
import java.util.Map;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import com.fasterxml.jackson.annotation.JsonView;
import com.google.common.collect.Lists;
import com.google.common.collect.Maps;

import minium.cucumber.report.domain.Element;
import minium.cucumber.report.domain.Result;
import minium.cucumber.report.domain.Step;
import minium.cucumber.report.domain.Views;

@JsonPropertyOrder({ "line", "name", "description", "id", "after", "type", "keyword", "steps", "background", "scenarioOutline", "rowIndex", "result", "profile", "profilesResults"})
public class ElementReport {
	
	@JsonView(Views.Public.class)
    private Integer line;
	
	@JsonView(Views.Public.class)
    private String name;

    @JsonView(Views.Public.class)
    private String description;
    
    @JsonView(Views.Public.class)
    private String id;
    
    @JsonView(Views.Public.class)
    private AfterReport after;
    
    @JsonView(Views.Public.class)
    private String type;
    
    @JsonView(Views.Public.class)
    private String keyword;
    
    @JsonView(Views.Public.class)
    private List<Step> steps = Lists.newArrayList();
    
    @JsonView(Views.Public.class)
    private BackgroundReport background;
    
    @JsonView(Views.Public.class)
    private ScenarioOutlineReport scenarioOutline;
    
    public ScenarioOutlineReport getScenarioOutline() {
		return scenarioOutline;
	}

	public void setScenarioOutline(ScenarioOutlineReport scenarioOutline) {
		this.scenarioOutline = scenarioOutline;
	}

	public Integer getRowIndex() {
		return rowIndex;
	}

	public void setRowIndex(Integer rowIndex) {
		this.rowIndex = rowIndex;
	}

	@JsonView(Views.Public.class)
    private Integer rowIndex;
    
    @JsonView(Views.Public.class)
    private Result result;
    
    @JsonView(Views.Public.class)
    private Map<String, Result> profilesResults = Maps.newHashMap();

	public ElementReport(Element e) {
		// TODO Auto-generated constructor stub
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

	public AfterReport getAfter() {
		return after;
	}

	public void setAfter(AfterReport after) {
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
		this.background = background;
	}

	public Result getResult() {
		return result;
	}

	public void setResult(Result result) {
		this.result = result;
	}

	public Map<String, Result> getProfilesResults() {
		return profilesResults;
	}

	public void setProfilesResults(Map<String, Result> profilesResults) {
		this.profilesResults = profilesResults;
	}
}
