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
package minium.project.generator.utils;

import com.google.common.base.CaseFormat;
import com.google.common.base.Joiner;

public final class Utils {

    private Utils() {
        // Do nothing
    }

    public static String toClassName(String name) {
        String result = splitUpperCaseIntoSpace(name);
        result = splitUnderscoreIntoSpace(result);
        result = splitDotsIntoSpace(result);
        result = replaceSpacesWithLowerHyphen(result);
        result = toCamelCase(result);
        return result;
    }

    public static String splitDotsIntoSpace(String str) {
        return str.replaceAll("(.)(\\.+)", "$1 ");
    }

    public static String splitUpperCaseIntoSpace(String str) {
        String[] r = str.split("(?=\\p{Upper})");
        return Joiner.on("-").join(r);
    }

    public static String splitUnderscoreIntoSpace(String str) {
        return str.replaceAll("(.)(\\_+)", "$1 ");
    }

    public static String replaceSpecialCharsWithSpaces(String name) {
        return name.replaceAll("[^\\w\\s]", " ");
    }

    public static String replaceSpacesWithLowerHyphen(String name) {
        return name.replaceAll("\\s+", "-");
    }

    public static String toCamelCase(String name) {
        return CaseFormat.LOWER_HYPHEN.to(CaseFormat.UPPER_CAMEL, name);
    }
}
