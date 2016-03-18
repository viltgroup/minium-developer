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

    static class Argument {

        @JsonView(Views.Public.class)
        private String val;

        @JsonView(Views.Public.class)
        private Integer offset;

        public Argument() {
        }

        @Override
        public int hashCode() {
            final int prime = 31;
            int result = 1;
            result = prime * result + ((offset == null) ? 0 : offset.hashCode());
            result = prime * result + ((val == null) ? 0 : val.hashCode());
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
            Argument other = (Argument) obj;
            if (offset == null) {
                if (other.offset != null)
                    return false;
            } else if (!offset.equals(other.offset))
                return false;
            if (val == null) {
                if (other.val != null)
                    return false;
            } else if (!val.equals(other.val))
                return false;
            return true;
        }
    }

    @JsonView(Views.Public.class)
    private List<Argument> arguments = Lists.newArrayList();

    @JsonView(Views.Public.class)
    private String location;

    public Match() {
    }

    @Override
    public int hashCode() {
        final int prime = 31;
        int result = 1;
        result = prime * result + ((arguments == null) ? 0 : arguments.hashCode());
        result = prime * result + ((location == null) ? 0 : location.hashCode());
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
        Match other = (Match) obj;
        if (arguments == null) {
            if (other.arguments != null)
                return false;
        } else if (!arguments.equals(other.arguments))
            return false;
        if (location == null) {
            if (other.location != null)
                return false;
        } else if (!location.equals(other.location))
            return false;
        return true;
    }

    public String getLocation() {
        return location;
    }
}
