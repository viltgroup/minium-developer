package minium.pupino.service;

import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;

import org.springframework.stereotype.Service;

import com.offbytwo.jenkins.JenkinsServer;
import com.offbytwo.jenkins.model.Build;
import com.offbytwo.jenkins.model.JobWithDetails;

@Service
public class JenkinsService {
	
	
	private JenkinsServer jenkins;
	
	private static URI uri;
	
	public JenkinsService() throws URISyntaxException{
		uri = new URI("http://lw255:8080/jenkins/");
	}
	
	public JobWithDetails uri(String jobName) throws IOException, URISyntaxException{
		jenkins = new JenkinsServer(uri, "admin", "admin");
		JobWithDetails job = jenkins.getJob(jobName);
		return job;
	}
	
	public List<Build> buildsForJob(String jobName) throws IOException, URISyntaxException{
		jenkins = new JenkinsServer(uri, "admin", "admin");
		return jenkins.getJob(jobName).getBuilds();
	}
	
	public void createBuild(String jobName) throws IOException, URISyntaxException{
		jenkins = new JenkinsServer(uri, "admin", "admin");
		JobWithDetails job = jenkins.getJob(jobName);
		job.build();
	}
	
	public void createJob(String jobName) throws IOException{
		jenkins = new JenkinsServer(uri, "admin", "admin");
		String sourceXml = jenkins.getJobXml("pupino-jenkins-test");
		jenkins.createJob(jobName, sourceXml);
	}
}
