package minium.pupino.jenkins;

import java.io.IOException;
import java.net.URISyntaxException;
import java.util.List;

import minium.pupino.web.rest.dto.BuildDTO;

import com.offbytwo.jenkins.model.Build;
import com.offbytwo.jenkins.model.BuildWithDetails;
import com.offbytwo.jenkins.model.JobWithDetails;


public interface JenkinsClient {

	public JobWithDetails uri(String jobName) throws IOException, URISyntaxException;

	/*
	 * JOBS
	 */
	public void createJob(String jobName) throws IOException;

	/*
	 * BUILDS
	 */
	public List<Build> buildsForJob(String jobName) throws IOException, URISyntaxException;

	public Build lastBuild(String jobName) throws IOException;

	public void createBuild(String jobName) throws IOException, URISyntaxException;

	public List<BuildDTO> getBuilds(String jobName) throws IOException, URISyntaxException;
	
	public BuildDTO getBuild(String jobName, String buildId, String featureURI) throws IOException, URISyntaxException;

	/*
	 * ARTIFACTS
	 */
	public String getArtifactsBuild(BuildWithDetails buildDetails);


}