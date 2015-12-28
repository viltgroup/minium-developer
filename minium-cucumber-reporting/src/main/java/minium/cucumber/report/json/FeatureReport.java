package minium.cucumber.report.json;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import com.fasterxml.jackson.annotation.JsonView;
import com.google.common.collect.Lists;

import minium.cucumber.report.domain.Element;
import minium.cucumber.report.domain.Feature;
import minium.cucumber.report.domain.Views;

@JsonPropertyOrder({ "line", "elements", "name", "description", "id", "keyword", "uri", "summary", "profile", "profiles" })
public class FeatureReport {
	
	public FeatureReport(Feature feature) {
		BackgroundReport bg = null;
		ScenarioOutlineReport so = null;
		int nRows = 0, rowIndex = 1;
		
		for (Element e : feature.getElements()) {
			switch (e.getType()) {
			case "background":
				bg = new BackgroundReport(e);
				break;
			case "scenario_outline":
				so = new ScenarioOutlineReport(e);
				nRows = e.getExamples().get(0).getRows().size();
				rowIndex = 1;
				break;
			default:
				elements.add(new ElementReport(e));
				if(rowIndex <= nRows){
					elements.get(elements.size() - 1).setScenarioOutline(so);
					rowIndex++;
				}
			}
		}
		
		if(bg != null)
			elements.get(elements.size() - 1).setBackground(bg);
		
		// handleSummary
	}

	@JsonView(Views.Public.class)
    private Integer line;
    
    @JsonView(Views.Full.class)
    private List<ElementReport> elements = Lists.newArrayList();
    
    @JsonView(Views.Public.class)
    private String name;
    
    @JsonView(Views.Public.class)
    private String description;
    
    @JsonView(Views.Public.class)
    private String id;
    
    @JsonView(Views.Public.class)
    private String keyword;
    
    @JsonView(Views.Public.class)
    private String uri;
    
    @JsonView(Views.Public.class)
    private SummaryReport summary;
    
    @JsonView(Views.Public.class)
    private String profile;
    
    @JsonView(Views.Public.class)
    private List<String> profiles;
}
