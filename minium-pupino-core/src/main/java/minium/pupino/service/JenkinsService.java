package minium.pupino.service;

import java.io.IOException;
import java.net.URISyntaxException;
import java.util.List;

import javax.xml.bind.JAXBException;

import minium.pupino.jenkins.JenkinsClient;
import minium.pupino.web.rest.dto.BrowsersDTO;
import minium.pupino.web.rest.dto.BuildDTO;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

import com.offbytwo.jenkins.model.Build;
import com.offbytwo.jenkins.model.BuildWithDetails;
import com.offbytwo.jenkins.model.JobWithDetails;

@Service
public class JenkinsService {
	
	@Autowired
	@Qualifier("jenkinsOAkClient")
	private JenkinsClient jenkinsClient;
	
	public JobWithDetails uri(String jobName) throws IOException, URISyntaxException {
		return jenkinsClient.uri(jobName);
	}
	
	/*
	 * JOBS
	 */
	public void createJob(String jobName,String scmType,String repository) throws IOException, JAXBException {
		jenkinsClient.createJob(jobName,scmType,repository);
	}
	
	/*
	 * BUILDS
	 */
	public List<Build> buildsForJob(String jobName) throws IOException, URISyntaxException {
		return jenkinsClient.buildsForJob(jobName);
	}
	
	public Build lastBuild(String jobName) throws IOException{
		return jenkinsClient.lastBuild(jobName);
	}
	
	public void createBuild(String jobName,BrowsersDTO buildConfig) throws IOException, URISyntaxException {
		jenkinsClient.createBuild(jobName,buildConfig);
	}
	
	public List<BuildDTO> getBuilds(String jobName) throws IOException, URISyntaxException {
		return jenkinsClient.getBuilds(jobName);
	}
	
	public BuildDTO getBuild(String jobName, String buildId, String featureURI) throws IOException, URISyntaxException{
		return jenkinsClient.getBuildAndFeature(jobName, buildId, featureURI);
	}
	
	public BuildDTO getBuildById(String jobName, String buildId) throws IOException, URISyntaxException{
		return jenkinsClient.getBuildById(jobName, buildId);
	}
	
	/*
	 * ARTIFACTS
	 */
	public String getArtifactsBuild(BuildWithDetails buildDetails){
		return jenkinsClient.getArtifactsBuild(buildDetails);
	}
}
