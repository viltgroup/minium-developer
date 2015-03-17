package minium.developer.utils;

import com.google.common.base.CaseFormat;
import com.google.common.base.Joiner;

public final class Utils {
	
	public static String toClassName(String name) {
		String result = splitUpperCaseIntoSpace(name);
		result = splitUnderscoreIntoSpace(result);
		result = replaceSpacesWithLowerHyphen(result);
		result = toCamelCase(result);
		return result;
    }
	
	public static String splitUpperCaseIntoSpace(String str) {
		String[] r = str.split("(?=\\p{Upper})");
		String name= Joiner.on("-").join(r);
		return name;
	}
	
	public static String splitUnderscoreIntoSpace(String str) {
		return str.replaceAll("(.)(\\_+)", "$1 ");
		
	}
	public static String replaceSpecialCharsWithSpaces(String name){
		String witoutSpecialChars = name.replaceAll("[^\\w\\s]", " ");
		return witoutSpecialChars;
	}
	
	public static String replaceSpacesWithLowerHyphen(String name){
		String toLowerHyphen = name.replaceAll("\\s+", "-");
		return toLowerHyphen;
	}
	
	public static String toCamelCase(String name){
		String result = CaseFormat.LOWER_HYPHEN.to(CaseFormat.UPPER_CAMEL, name);
		return result;
	}
}
