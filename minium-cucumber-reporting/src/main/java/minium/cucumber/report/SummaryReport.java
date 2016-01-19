package minium.cucumber.report;

import com.fasterxml.jackson.annotation.JsonView;

import minium.cucumber.report.domain.Views;

public class SummaryReport {
	
	@JsonView(Views.Public.class)
	private Integer failingScenarios;

	@JsonView(Views.Public.class)
	private Integer passingScenarios;

	@JsonView(Views.Public.class)
	private Integer totalScenarios;
	
	@JsonView(Views.Public.class)
	private Double totalDuration;

	public SummaryReport(){
	}
	
	public Integer getFailingScenarios() {
		return failingScenarios;
	}
	
	public Integer getPassingScenarios() {
		return passingScenarios;
	}

	public Integer getTotalScenarios() {
		return totalScenarios;
	}

	public Double getTotalDuration() {
		return totalDuration;
	}
	
	public void setFailingScenarios(int failingScenarios) {
		this.failingScenarios = failingScenarios;
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
