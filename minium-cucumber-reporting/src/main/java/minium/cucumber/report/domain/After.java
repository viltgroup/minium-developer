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
        if (result != null) {
            result = null;
        }
    }

}
