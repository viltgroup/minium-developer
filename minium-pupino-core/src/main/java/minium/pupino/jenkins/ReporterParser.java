package minium.pupino.jenkins;

import java.io.FileNotFoundException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import minium.pupino.web.rest.dto.SummaryDTO;
import net.masterthought.cucumber.json.Feature;

import org.springframework.stereotype.Component;

import com.google.gson.Gson;
import com.google.gson.JsonIOException;
import com.google.gson.JsonSyntaxException;

@Component
public class ReporterParser {
	
	/**
	 * Parse the results from the jenkins report
	 * @param results
	 * @return
	 * @throws JsonSyntaxException
	 * @throws JsonIOException
	 * @throws FileNotFoundException
	 */
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

	public SummaryDTO getSummaryFromResult(String results) throws JsonSyntaxException, JsonIOException, FileNotFoundException {
		SummaryDTO summary;
		int totalScenarios = 0, passingScenarios = 0, failingScenarios = 0;
		List<Feature> features = parseJsonResult(results);
		for (Feature f : features) {
			f.processSteps();
			totalScenarios   += f.getNumberOfScenarios();
			passingScenarios += f.getNumberOfScenariosPassed();
			failingScenarios += f.getNumberOfScenariosFailed();
		}
		summary = new SummaryDTO(totalScenarios,passingScenarios,failingScenarios);
		return summary;
	}
	
	public SummaryDTO getSummaryFromFeatures(List<Feature> features) throws JsonSyntaxException, JsonIOException, FileNotFoundException {
		SummaryDTO summary;
		int totalScenarios = 0, passingScenarios = 0, failingScenarios = 0;
		for (Feature f : features) {
			f.processSteps();
			totalScenarios   += f.getNumberOfScenarios();
			passingScenarios += f.getNumberOfScenariosPassed();
			failingScenarios += f.getNumberOfScenariosFailed();
		}
		summary = new SummaryDTO(totalScenarios,passingScenarios,failingScenarios);
		return summary;
	}

}
