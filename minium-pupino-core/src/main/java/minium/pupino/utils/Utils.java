package minium.pupino.utils;

import java.util.List;

public class Utils {
	
	public static String array2String(List<Integer> lines){
		StringBuilder sb = new StringBuilder() ;
		for( Integer line : lines){
			sb.append(line).append(":");
		}
		sb.deleteCharAt(sb.length()-1);
		
		return sb.toString();
	}
}
