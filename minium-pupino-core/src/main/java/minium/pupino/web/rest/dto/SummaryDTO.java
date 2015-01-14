package minium.pupino.web.rest.dto;

import java.util.List;

import net.masterthought.cucumber.json.Element;

public class SummaryDTO {

	int totalScenarios;
	int passingScenarios;
	int faillingScenarios;
	List<Element> failingScenariosList;
	
	public SummaryDTO(int totalScenarios, int passingScenarios, int faillingScenarios,List<Element> failingScenariosList) {
		super();
		this.totalScenarios = totalScenarios;
		this.passingScenarios = passingScenarios;
		this.faillingScenarios = faillingScenarios;
		this.failingScenariosList =  failingScenariosList;
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

	public List<Element> getFailingScenariosList() {
		return failingScenariosList;
	}

	public void setFailingScenariosList(List<Element> failingScenariosList) {
		this.failingScenariosList = failingScenariosList;
	}
	
	
	
}
