package minium.pupino.jenkins;

import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;

import minium.pupino.utils.UrlUtils;
import minium.pupino.web.rest.dto.BuildDTO;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Component;

import com.google.common.collect.Lists;
import com.offbytwo.jenkins.JenkinsServer;
import com.offbytwo.jenkins.model.Artifact;
import com.offbytwo.jenkins.model.Build;
import com.offbytwo.jenkins.model.BuildWithDetails;
import com.offbytwo.jenkins.model.JobWithDetails;

@Component
@Qualifier("jenkinsOAkClient")
public class JenkinsClientAdaptor implements JenkinsClient{

	private JenkinsServer jenkins;
	
	private static URI uri;
	
	public JenkinsClientAdaptor() throws URISyntaxException {
		uri = new URI("http://lw255:8080/jenkins/");
	}
	
	@Override
	public JobWithDetails uri(String jobName) throws IOException, URISyntaxException {
		jenkins = new JenkinsServer(uri, "admin", "admin");
		JobWithDetails job = jenkins.getJob(jobName);
		return job;
	}
	
	/*
	 * JOBS
	 */
	@Override
	public void createJob(String jobName) throws IOException {
		jenkins = new JenkinsServer(uri, "admin", "admin");
		String sourceXml = jenkins.getJobXml("pupino-jenkins-test");
		jenkins.createJob(jobName, sourceXml);
	}
	
	
	/*
	 * BUILDS
	 */
	@Override
	public List<Build> buildsForJob(String jobName) throws IOException, URISyntaxException {
		jenkins = new JenkinsServer(uri, "admin", "admin");
		return jenkins.getJob(jobName).getBuilds();
	}
	
	@Override
	public Build lastBuild(String jobName) throws IOException{
		jenkins = new JenkinsServer(uri, "admin", "admin");
		return jenkins.getJob(jobName).getLastCompletedBuild();
	}
	
	@Override
	public void createBuild(String jobName) throws IOException, URISyntaxException {
		jenkins = new JenkinsServer(uri, "admin", "admin");
		JobWithDetails job = jenkins.getJob(jobName);
		job.build();
	}
	@Override
	public List<BuildDTO> getBuilds(String jobName) throws IOException, URISyntaxException {
		List<Build> builds = buildsForJob(jobName);
		List<BuildDTO> buildsDTO = Lists.newArrayList();
		BuildDTO buildDTO;
		BuildWithDetails bd;
		boolean lastBuild = true;
		
		for (Build b : builds) {
			String artifact = "";
			bd = b.details();
			String result;
			if (bd.getResult() != null)
				result = bd.getResult().toString();
			else
				result = "BUILDING";
			
			//only want the report of the lastBuild 
			if( lastBuild ){
				//get the artifact of the build and return the string
				artifact = getArtifactsBuild(bd);
				lastBuild = false;
			}
			
			buildDTO = new BuildDTO(b.getNumber(), b.getUrl(), bd.getActions(), bd.isBuilding(), bd.getDescription(), bd.getDuration(),
					bd.getFullDisplayName(), bd.getId(), bd.getTimestamp(), result, artifact );

			buildsDTO.add(buildDTO);
		}
		
		return buildsDTO;
	}
	
	/*
	 * ARTIFACTS
	 */
	@Override
	public String getArtifactsBuild(BuildWithDetails buildDetails){
		String artifactContent = "";
		if (!buildDetails.getArtifacts().isEmpty()) {
			Artifact artifact = buildDetails.getArtifacts().get(0);
			
			//function from the jenkins client was not working properly 
			//use this temporary solution
			if( artifact.getDisplayPath().equals("result.json")){
				artifactContent = UrlUtils.extractContentAsString(buildDetails.getUrl() + "artifact/result.json", buildDetails.getId());
			}
		}
		return artifactContent;
	}
}
