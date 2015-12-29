package minium.cucumber.report.domain;

import com.fasterxml.jackson.annotation.JsonView;

public class After {
	@JsonView(Views.Public.class)
    private Result result;

    public Result getResult() {
		return result;
	}

	public void setResult(Result result) {
		this.result = result;
	}

	@JsonView(Views.Public.class)
    private Match match;
}
