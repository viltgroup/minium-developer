package minium.pupino.service;

import java.io.IOException;
import java.net.URISyntaxException;
import java.util.List;

import minium.pupino.jenkins.JenkinsClient;
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
	public void createJob(String jobName) throws IOException {
		jenkinsClient.createJob(jobName);
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
	
	public void createBuild(String jobName) throws IOException, URISyntaxException {
		jenkinsClient.createBuild(jobName);
	}
	
	public List<BuildDTO> getBuilds(String jobName) throws IOException, URISyntaxException {
		return jenkinsClient.getBuilds(jobName);
	}
	
	public BuildDTO getBuild(String jobName, String buildId, String featureURI) throws IOException, URISyntaxException{
		return jenkinsClient.getBuild(jobName, buildId, featureURI);
	}
	
	/*
	 * ARTIFACTS
	 */
	public String getArtifactsBuild(BuildWithDetails buildDetails){
		return jenkinsClient.getArtifactsBuild(buildDetails);
	}
}
