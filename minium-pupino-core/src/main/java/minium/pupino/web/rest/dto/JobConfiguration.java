package minium.pupino.web.rest.dto;

import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

@XmlRootElement(name = "project")
public class JobConfiguration {
	
	String description;
	String goals;
	
	public JobConfiguration() {
	}

	public String getDescription() {
		return description;
	}
	
	@XmlElement
	public void setDescription(String description) {
		this.description = description;
	}

	public String getGoals() {
		return goals;
	}
	
	@XmlElement
	public void setGoals(String goals) {
		this.goals = goals;
	}
	
	
}
