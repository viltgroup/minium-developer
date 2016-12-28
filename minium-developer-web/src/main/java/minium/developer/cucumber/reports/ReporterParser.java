package minium.developer.cucumber.reports;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import minium.cucumber.report.domain.Feature;

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
}
