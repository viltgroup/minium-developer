package minium.pupino.jenkins;

import java.io.FileNotFoundException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import net.masterthought.cucumber.json.Feature;

import com.google.gson.Gson;
import com.google.gson.JsonIOException;
import com.google.gson.JsonSyntaxException;

public class ReporterParser {

	public List<Feature> parseJsonResult(String results) throws JsonSyntaxException, JsonIOException, FileNotFoundException {
		List<Feature> features = new ArrayList<Feature>();
		Feature[] features1 = new Gson().fromJson(results, Feature[].class);
		features.addAll(Arrays.asList(features1));
		return features;
	}

	public Map<String, Feature> parseJsonResultSet(String results) throws JsonSyntaxException, JsonIOException, FileNotFoundException {
		Map<String, Feature> features = new HashMap<String, Feature>();
		Feature[] features1 = new Gson().fromJson(results, Feature[].class);
		for (Feature f : features1) {
			features.put(f.getUri(), f);
		}
		return features;
	}

}
