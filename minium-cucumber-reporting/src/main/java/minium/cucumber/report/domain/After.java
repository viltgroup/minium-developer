package minium.cucumber.report.domain;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonView;
import com.fasterxml.jackson.annotation.JsonInclude.Include;

@JsonInclude(Include.NON_NULL)
public class After {
	
	@JsonView(Views.Public.class)
    private Result result;
	
	@JsonView(Views.Public.class)
    private Match match;

    public Result getResult() {
		return result;
	}
	
}
