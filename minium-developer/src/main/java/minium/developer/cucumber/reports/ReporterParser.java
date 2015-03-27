package minium.developer.cucumber.reports;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import minium.cucumber.report.domain.Element;
import minium.cucumber.report.domain.Feature;
import minium.developer.web.rest.dto.SummaryDTO;

import org.springframework.stereotype.Component;

import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;

@Component
public class ReporterParser {

    private final ObjectMapper mapper;

    public ReporterParser() {
        mapper = new ObjectMapper();
        mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
        mapper.configure(DeserializationFeature.FAIL_ON_IGNORED_PROPERTIES, false);
    }

	/**
	 * Parse the results from the generated cucumber report
	 * @param results
	 * @return
	 * @throws IOException
	 * @throws JsonMappingException
	 * @throws JsonParseException
	 * @throws JsonSyntaxException
	 * @throws JsonIOException
	 * @throws FileNotFoundException
	 */
	public List<Feature> parseJsonResult(String results) throws IOException {
		Feature[] features = mapper.readValue(results, Feature[].class);
		return Arrays.asList(features);
	}

	public Map<String, Feature> parseJsonResultSet(String results) throws IOException {
		Map<String, Feature> featuresMap = new HashMap<String, Feature>();
		Feature[] features = mapper.readValue(results, Feature[].class);
		for (Feature f : features) {
		    featuresMap.put(f.getUri(), f);
		}
		return featuresMap;
	}

	public SummaryDTO getSummaryFromResult(String results) throws IOException {
		SummaryDTO summary;
		int totalScenarios = 0, passingScenarios = 0, failingScenarios = 0;
		List<Feature> features = parseJsonResult(results);
		List<Element> elem  = new ArrayList<Element>();
//		for (Feature f : features) {
//			f.processSteps();
//			totalScenarios   += f.getNumberOfScenarios();
//			passingScenarios += f.getNumberOfScenariosPassed();
//			failingScenarios += f.getNumberOfScenariosFailed();
//		}
		summary = new SummaryDTO(totalScenarios,passingScenarios,failingScenarios,elem);
		return summary;
	}

	public SummaryDTO getSummaryFromFeatures(List<Feature> features) throws IOException {
		SummaryDTO summary;
		int totalScenarios = 0, passingScenarios = 0, failingScenarios = 0;
		List<Element> elem  = new ArrayList<Element>();
//		for (Feature f : features) {
//			f.processSteps();
//			totalScenarios   += f.getNumberOfScenarios();
//			passingScenarios += f.getNumberOfScenariosPassed();
//			failingScenarios += f.getNumberOfScenariosFailed();
//		}
		summary = new SummaryDTO(totalScenarios,passingScenarios,failingScenarios,elem);
		return summary;
	}

}
