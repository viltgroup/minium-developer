package minium.cucumber.report;

import com.fasterxml.jackson.annotation.JsonView;

import minium.cucumber.report.domain.Views;

public class SummaryReport {
	
	@JsonView(Views.Public.class)
	private Integer totalScenarios;
	
	@JsonView(Views.Public.class)
	private Integer passingScenarios;
	
	@JsonView(Views.Public.class)
	private Double totalDuration;

	public SummaryReport(){
	}

	public void setPassingScenarios(Integer passingScenarios) {
		this.passingScenarios = passingScenarios;
	}
	
	public void setTotalDuration(Double totalDuration) {
		this.totalDuration = totalDuration;
	}
	
	public void setTotalScenarios(Integer totalScenarios) {
		this.totalScenarios = totalScenarios;
	}

}
