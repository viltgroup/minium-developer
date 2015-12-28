package minium.cucumber.report.json;

import com.fasterxml.jackson.annotation.JsonView;

import minium.cucumber.report.domain.Views;

public class SummaryReport {
	
	@JsonView(Views.Public.class)
	private Integer totalScenarios;
	
	@JsonView(Views.Public.class)
	private Integer passingScenarios;
	
	@JsonView(Views.Public.class)
	private Double totalDuration;
}
