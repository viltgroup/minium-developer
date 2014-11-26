package minium.pupino.web.rest.dto;

import java.util.List;

import net.masterthought.cucumber.json.Feature;

public class BuildDTO {

	int number;
	String url;
	List actions;
	boolean building;
	String description;
	int duration;
	String fullDisplayName;
	String id;
	long timestamp;
	String result;
	String resultJSON;
	List<Feature> features;
	
	public BuildDTO(int number, String url, List actions, boolean building, String description, int duration, String fullDisplayName, String id,
			long timestamp, String result, String resultJSON, List<Feature> features) {
		super();
		this.number = number;
		this.url = url;
		this.actions = actions;
		this.building = building;
		this.description = description;
		this.duration = duration;
		this.fullDisplayName = fullDisplayName;
		this.id = id;
		this.timestamp = timestamp;
		this.result = result;
		this.resultJSON = resultJSON;
		this.features = features;
	}


	public BuildDTO(int number, String url, List actions, boolean building, String description, int duration, String fullDisplayName,
			String id, long timestamp, String result,String resultJSON) {
		super();
		this.number = number;
		this.url = url;
		this.actions = actions;
		this.building = building;
		this.description = description;
		this.duration = duration;
		this.fullDisplayName = fullDisplayName;
		this.id = id;
		this.timestamp = timestamp;
		this.result = result;
		this.resultJSON = resultJSON;
	}
	
	
	public BuildDTO() {
		super();
	}
	
	
	public int getNumber() {
		return number;
	}
	public void setNumber(int number) {
		this.number = number;
	}
	public String getUrl() {
		return url;
	}
	public void setUrl(String url) {
		this.url = url;
	}
	public List getActions() {
		return actions;
	}
	public void setActions(List actions) {
		this.actions = actions;
	}
	public boolean isBuilding() {
		return building;
	}
	public void setBuilding(boolean building) {
		this.building = building;
	}
	public String getDescription() {
		return description;
	}
	public void setDescription(String description) {
		this.description = description;
	}
	public int getDuration() {
		return duration;
	}
	public void setDuration(int duration) {
		this.duration = duration;
	}

	public String getFullDisplayName() {
		return fullDisplayName;
	}
	public void setFullDisplayName(String fullDisplayName) {
		this.fullDisplayName = fullDisplayName;
	}
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public long getTimestamp() {
		return timestamp;
	}
	public void setTimestamp(long timestamp) {
		this.timestamp = timestamp;
	}


	public String getResult() {
		return result;
	}


	public void setResult(String result) {
		this.result = result;
	}


	public String getResultJSON() {
		return resultJSON;
	}


	public void setResultJSON(String resultJSON) {
		this.resultJSON = resultJSON;
	}


	public List<Feature> getFeatures() {
		return features;
	}


	public void setFeatures(List<Feature> features) {
		this.features = features;
	}


	
	
	
}
