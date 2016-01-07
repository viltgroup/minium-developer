/*
 * Copyright (C) 2015 The Minium Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package minium.cucumber.report.domain;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import com.fasterxml.jackson.annotation.JsonView;
import com.google.common.collect.Lists;

@JsonPropertyOrder({
	"arguments",
	"location" })
@JsonInclude(Include.NON_EMPTY) 
public class Match {
	
	static class Argument{
		@JsonView(Views.Public.class)
        private String val;
    	
    	@JsonView(Views.Public.class)
        private Integer offset;
    	
		public Argument(){
		}
	}
	
	@JsonView(Views.Public.class)
    private List<Argument> arguments = Lists.newArrayList();

    @JsonView(Views.Public.class)
    private String location;
    
    public Match() {
    }

    public String getLocation() {
        return location;
    }
}
