package minium.pupino.web.rest.dto;

public class TestExecutionDTO {

	private String body;
	private String type;
	private String step;

	public TestExecutionDTO() {
	}

	public TestExecutionDTO(String body, String type, String step) {
		this.body = body;
		this.type = type;
		this.step = step;
	}

	public String getBody() {
		return body;
	}

	public void setBody(String body) {
		this.body = body;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public String getStep() {
		return step;
	}

	public void setStep(String step) {
		this.step = step;
	}

}
