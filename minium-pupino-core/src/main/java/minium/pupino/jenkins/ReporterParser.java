package minium.pupino.jenkins;

import gherkin.deps.com.google.gson.Gson;
import gherkin.deps.com.google.gson.JsonIOException;
import gherkin.deps.com.google.gson.JsonSyntaxException;

import java.io.File;
import java.io.FileNotFoundException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import net.masterthought.cucumber.ReportBuilder;
import net.masterthought.cucumber.json.Feature;


public class ReporterParser {
	
	
	public List<Feature> parseJsonResult(String results) throws JsonSyntaxException, JsonIOException, FileNotFoundException{
		List<Feature> features = new ArrayList<Feature>();
		Feature[] features1 = new Gson().fromJson(results, Feature[].class);
		
		features.addAll( Arrays.asList(features1) );
		
		return features;
	}
	
	public void generateReport() throws Exception{
		 //String firstIssuesTitle = JsonPath.read("sdsd", "$.[0].title");
		 
		 File reportOutputDirectory = new File("cucumber-html-reports");
		 ArrayList<String> list = new ArrayList<String>();
		 
		 list.add("test2014-11-24_19-04-43.json");
		 list.add("test2014-11-24_15-27-14.json");

		 String buildNumber = "1";
		 String buildProjectName = "super_project";
		 Boolean skippedFails = false;
		 Boolean undefinedFails = false;
		 Boolean flashCharts = true;
		 Boolean runWithJenkins = true;
		 ReportBuilder reportBuilder = new ReportBuilder(list,reportOutputDirectory,"","95","cucumber-jvm",false,false,true,true,false,"", runWithJenkins);
		 reportBuilder.generateReports();
	}
	
	 
}

