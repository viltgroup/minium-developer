package minium.cucumber.report.json;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import com.fasterxml.jackson.annotation.JsonView;
import com.google.common.collect.Lists;

import minium.cucumber.report.domain.Element;
import minium.cucumber.report.domain.Step;
import minium.cucumber.report.domain.Views;

@JsonPropertyOrder({"line", "name", "description", "type", "keyword", "steps"})
public class BackgroundReport {

	public BackgroundReport(Element e) {
		
	}

	@JsonView(Views.Public.class)
    private String line;
	
	@JsonView(Views.Public.class)
    private String name;

    @JsonView(Views.Public.class)
    private String description;
    
    @JsonView(Views.Public.class)
    private String type;
    
    @JsonView(Views.Public.class)
    private String keyword;
    
    @JsonView(Views.Public.class)
    private List<Step> steps = Lists.newArrayList();
    
}
