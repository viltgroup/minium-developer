package minium.pupino.utils;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.MalformedURLException;
import java.net.URL;
import java.net.URLConnection;

public class UrlUtils {

	public static String extractContentAsString(String urlPath,String id){
		StringBuilder sb = null;
		URL url;
		try {
			// get URL content
			url = new URL(urlPath);
			URLConnection conn = url.openConnection();

			// open the stream and put it into BufferedReader
			BufferedReader br = new BufferedReader(new InputStreamReader(conn.getInputStream()));

			String inputLine;

			// save to this filename
			String fileName = "test" + id + ".json";
			File file = new File(fileName);
			sb = new StringBuilder();
			
			if (!file.exists()) {
				file.createNewFile();
			}

			// use FileWriter to write file
			FileWriter fw = new FileWriter(file.getAbsoluteFile());
			BufferedWriter bw = new BufferedWriter(fw);

			while ((inputLine = br.readLine()) != null) {
				bw.write(inputLine);
				sb.append(inputLine);
			}

			bw.close();
			br.close();

			System.out.println("Done");

		} catch (MalformedURLException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
		return sb.toString();
	}
}
