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
    
    @Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((match == null) ? 0 : match.hashCode());
		return result;
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		After other = (After) obj;
		if (match == null) {
			if (other.match != null)
				return false;
		} else if (!match.equals(other.match))
			return false;
		return true;
	}
    
    public Result getResult() {
		return result;
	}
    
    public void combineAfter(String profile, After after) {
		results.put(profile, after.getResult());
		if(result != null){
			result = null;
		}	
	}
	
}
