package minium.pupino.utils;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStreamReader;
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
	
	public static String artifactFromFile(String file) {
		BufferedReader br = null;
		String artifactContent = null;
		try {
			File fileDir = new File(file);

			br = new BufferedReader(new InputStreamReader(new FileInputStream(fileDir), "UTF8"));
			StringBuilder sb = new StringBuilder();
			String line = br.readLine();

			while (line != null) {
				sb.append(line);
				sb.append(System.lineSeparator());
				line = br.readLine();
			}
			artifactContent = sb.toString();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} finally {
			try {
				br.close();
			} catch (IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}
		return artifactContent;
	}
}
