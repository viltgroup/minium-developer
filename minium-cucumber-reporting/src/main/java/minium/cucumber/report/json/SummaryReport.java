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

	public SummaryReport(){
		
	}
	
	public Integer getTotalScenarios() {
		return totalScenarios;
	}

	public void setTotalScenarios(Integer totalScenarios) {
		this.totalScenarios = totalScenarios;
	}

	public Integer getPassingScenarios() {
		return passingScenarios;
	}

	public void setPassingScenarios(Integer passingScenarios) {
		this.passingScenarios = passingScenarios;
	}

	public Double getTotalDuration() {
		return totalDuration;
	}

	public void setTotalDuration(Double totalDuration) {
		this.totalDuration = totalDuration;
	}
}
