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
