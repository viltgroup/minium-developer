package minium.cucumber.report.domain;

import java.util.Map;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonView;
import com.fasterxml.jackson.annotation.JsonInclude.Include;
import com.google.common.collect.Maps;

@JsonInclude(Include.NON_NULL)
public class After {
	
	@JsonView(Views.Public.class)
    private Result result;
	
	@JsonView(Views.Public.class)
    private Match match;
    
    @JsonInclude(Include.NON_EMPTY)
    @JsonView(Views.Public.class)
    private Map<String, Result> results = Maps.newHashMap();
    
    public Result getResult() {
		return result;
	}
    
    public void addResult(String profile, After after) {
		results.put(profile, after.getResult());
		if(result != null){
			result = null;
		}	
	}
	
}
