package minium.cucumber.report;

import java.util.List;
import java.util.Map;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import com.fasterxml.jackson.annotation.JsonView;
import com.fasterxml.jackson.annotation.JsonInclude.Include;
import com.google.common.collect.Lists;
import com.google.common.collect.Maps;

import minium.cucumber.report.domain.Comment;
import minium.cucumber.report.domain.Element;
import minium.cucumber.report.domain.Example;
import minium.cucumber.report.domain.Feature;
import minium.cucumber.report.domain.Result;
import minium.cucumber.report.domain.Status;
import minium.cucumber.report.domain.Views;

@JsonInclude(Include.NON_NULL)
@JsonPropertyOrder({
		"id",
		"name",
		"description",
		"keyword",
		"line",
		"uri",
		"status",
		"profileStatus",
		"summary",
		"examples",
		"elements",
		"comments" })
public class FeatureReport {

	@JsonInclude(Include.NON_EMPTY)
    @JsonView(Views.Public.class)
    private List<Comment> comments = Lists.newArrayList();
	
	@JsonView(Views.Public.class)
	private Integer line;

	@JsonView(Views.Public.class)
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
	private Summary summary;
	
	@JsonInclude(Include.NON_EMPTY)
	@JsonView(Views.Public.class)
	private Map<String, List<Example>> examples = Maps.newHashMap();
	
	@JsonInclude(Include.NON_EMPTY)
	@JsonView(Views.Public.class)
	private Map<String, Status> profileStatus = Maps.newHashMap();
	
	@JsonView(Views.Public.class)
	private Status status;
	
	public FeatureReport() {
	}

	public FeatureReport(Feature feature) {
		ElementReport background = null;
		int nRows = 0, rowIndex = 1;

		for (Element e : feature.getElements()) {
			switch (e.getType()) {
			case "background":
				background = new ElementReport(e);
				background.setType(null);
				break;
			case "scenario_outline":
				examples.put(e.getId(), e.getExamples());
				nRows = e.getExamples().get(0).getRows().size();
				rowIndex = 1;
				break;
			default:
				ElementReport er = new ElementReport(e);
				er.setBackground(background);
				elements.add(er);
				if (rowIndex <= nRows) {
					elements.get(elements.size() - 1).setRowIndex(rowIndex);
					rowIndex++;
				}
			}

		}

		int passingScenarios = 0, totalScenarios = 0;
		double totalDuration = 0D;
		Result r;
		status = Status.PASSED;
		for (ElementReport e : elements) {
			r = e.getResult();
			if (r.getStatus() == Status.PASSED) {
				passingScenarios += 1;
			}
			else{
				status = r.getStatus();
			}
			if (r.getDuration() != null)
				totalDuration += r.getDuration();
			totalScenarios += 1;
		}
		summary = new Summary();
		summary.setPassingScenarios(passingScenarios);
		summary.setTotalDuration(totalDuration / 1000000);
		summary.setTotalScenarios(totalScenarios);

		comments = feature.getComments();
		line = feature.getLine();
		description = feature.getDescription();
		name = feature.getName();
		id = feature.getId();
		keyword = feature.getKeyword();
		uri = feature.getUri();
	}

	public List<ElementReport> getElements() {
		return elements;
	}
	
	public Status getStatus() {
        return status;
    }
	
	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((line == null) ? 0 : line.hashCode());
		result = prime * result + ((uri == null) ? 0 : uri.hashCode());
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
		FeatureReport other = (FeatureReport) obj;
		if (line == null) {
			if (other.line != null)
				return false;
		} else if (!line.equals(other.line))
			return false;
		if (uri == null) {
			if (other.uri != null)
				return false;
		} else if (!uri.equals(other.uri))
			return false;
		return true;
	}

	public void combineFeature(String profile, FeatureReport feature) {
		for (ElementReport element : elements) {
			ElementReport bg = element.getBackground();
			if(element.getBackground() != null){
				bg.addProfileResults(profile, feature.getElements().get(feature.getElements().indexOf(element)).getBackground());
			}
			element.addProfileResults(profile, feature.getElements().get(feature.getElements().indexOf(element)));
		}
		this.profileStatus.put(profile, feature.getStatus());
		status = null;
	}
}
