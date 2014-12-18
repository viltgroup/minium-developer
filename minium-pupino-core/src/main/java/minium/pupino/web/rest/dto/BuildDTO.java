package minium.pupino.web.rest.dto;

import java.util.List;

import net.masterthought.cucumber.json.Feature;

public class BuildDTO {
	
	long id;
	int number;
	String url;
	boolean building;
	String description;
	int duration;
	String fullDisplayName;
	String key;
	long timestamp;
	String result;
	SummaryDTO summary;
	List<Feature> features;
	String resultJSON;
	
	public BuildDTO(long id,int number, String url, boolean building, String description, int duration, String fullDisplayName, String key,
			long timestamp, String result, String resultJSON, List<Feature> features,SummaryDTO summary) {
		super();
		this.number = number;
		this.url = url;
		this.building = building;
		this.description = description;
		this.duration = duration;
		this.fullDisplayName = fullDisplayName;
		this.id = id;
		this.key = key;
		this.timestamp = timestamp;
		this.result = result;
		this.features = features;
		this.summary = summary;
		this.resultJSON = resultJSON;
	}


	public BuildDTO(long id, int number, String url, List actions, boolean building, String description, int duration, String fullDisplayName,
			String key, long timestamp, String result,SummaryDTO summary) {
		super();
		this.number = number;
		this.url = url;
		this.building = building;
		this.description = description;
		this.duration = duration;
		this.fullDisplayName = fullDisplayName;
		this.id = id;
		this.key = key;
		this.timestamp = timestamp;
		this.result = result;
		this.summary = summary;
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
	public long getId() {
		return id;
	}
	public void setId(long id) {
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


	public List<Feature> getFeatures() {
		return features;
	}


	public void setFeatures(List<Feature> features) {
		this.features = features;
	}


	public SummaryDTO getSummary() {
		return summary;
	}


	public void setSummary(SummaryDTO summary) {
		this.summary = summary;
	}


	public String getResultJSON() {
		return resultJSON;
	}


	public void setResultJSON(String resultJSON) {
		this.resultJSON = resultJSON;
	}


	public String getKey() {
		return key;
	}


	public void setKey(String key) {
		this.key = key;
	}


	
	
	
}
