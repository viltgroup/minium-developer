package minium.pupino.web.rest.dto;

public class SummaryDTO {

	int totalScenarios;
	int passingScenarios;
	int faillingScenarios;
	
	public SummaryDTO(int totalScenarios, int passingScenarios, int faillingScenarios) {
		super();
		this.totalScenarios = totalScenarios;
		this.passingScenarios = passingScenarios;
		this.faillingScenarios = faillingScenarios;
	}
	
	public SummaryDTO() {
		super();
		this.totalScenarios = 0;
		this.passingScenarios = 0;
		this.faillingScenarios = 0;
	}
	
	public int getTotalScenarios() {
		return totalScenarios;
	}
	public void setTotalScenarios(int totalScenarios) {
		this.totalScenarios = totalScenarios;
	}
	public int getPassingScenarios() {
		return passingScenarios;
	}
	public void setPassingScenarios(int passingScenarios) {
		this.passingScenarios = passingScenarios;
	}
	public int getFaillingScenarios() {
		return faillingScenarios;
	}
	public void setFaillingScenarios(int faillingScenarios) {
		this.faillingScenarios = faillingScenarios;
	}
	
	
	
}
