package minium.cucumber.report.json;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import com.fasterxml.jackson.annotation.JsonView;

import minium.cucumber.report.domain.Match;
import minium.cucumber.report.domain.Result;
import minium.cucumber.report.domain.Views;

@JsonPropertyOrder({ "result", "match"})
public class AfterReport {

	@JsonView(Views.Public.class)
    private Result result;
	
	@JsonView(Views.Public.class)
    private Match match;
}
