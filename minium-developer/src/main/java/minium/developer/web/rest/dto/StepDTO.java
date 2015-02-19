package minium.developer.web.rest.dto;

public class StepDTO {

	private String name;
	private Integer line;
	private String uri;
	private String status;

	public StepDTO() {
		super();
	}

	public StepDTO(String name, Integer line, String uri, String status) {
		super();
		this.name = name;
		this.line = line;
		this.uri = uri;
		this.status = status;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public Integer getLine() {
		return line;
	}

	public void setLine(Integer line) {
		this.line = line;
	}

	public String getUri() {
		return uri;
	}

	public void setUri(String uri) {
		this.uri = uri;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

}
