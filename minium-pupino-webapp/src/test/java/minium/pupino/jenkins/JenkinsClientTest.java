package minium.pupino.jenkins;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertTrue;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.Map;

import org.apache.commons.lang.RandomStringUtils;
import org.junit.Before;
import org.junit.Test;

import com.google.common.collect.Maps;
import com.offbytwo.jenkins.JenkinsServer;
import com.offbytwo.jenkins.model.Job;
import com.offbytwo.jenkins.model.JobWithDetails;

public class JenkinsClientTest {

	private JenkinsServer jenkins;
	
	private static final String JENKINS_TEST_JOB = "pupino-jenkins-test";
	private static final String uri = "http://lw255:8080/jenkins/";

	@Before
	public void setUp() throws URISyntaxException {
		jenkins = new JenkinsServer(new URI(uri), "admin", "admin");
	}

	@Test
	public void shoulGetJobByName() throws Exception {
		JobWithDetails job = jenkins.getJob(JENKINS_TEST_JOB);
		assertEquals(JENKINS_TEST_JOB, job.getName());
		assertEquals(JENKINS_TEST_JOB, job.getDisplayName());
	}

	@Test
	public void shouldntGetJobByName() throws Exception {
		JobWithDetails job = jenkins.getJob(JENKINS_TEST_JOB + "ca");
		assertEquals(null, job);
	}

	@Test
	public void shouldReturnListOfJobs() throws Exception {
		Map<String, Job> jobs = jenkins.getJobs();
		assertTrue(jobs.containsKey(JENKINS_TEST_JOB));

	}

	@Test
	public void shouldCreateJob() throws Exception {
		final String jobName = "test-job-" + RandomStringUtils.randomNumeric(3);
		String sourceXml = jenkins.getJobXml(JENKINS_TEST_JOB);
		
		jenkins.createJob(jobName, sourceXml);
		Map<String, Job> jobs = jenkins.getJobs();
		assertTrue(jobs.containsKey(jobName));
		JobWithDetails thisJob = jobs.get(jobName).details();
		assertNotNull(thisJob);
		
		assertTrue(thisJob.getBuilds().size() == 0);
	}

	@Test
	public void shouldBuildAJob() throws Exception {
		final String jobName = "test-job-" + RandomStringUtils.randomNumeric(3);
		
		JobWithDetails job = jenkins.getJob(JENKINS_TEST_JOB);

		Map<String,String> parameters = Maps.newHashMap();
		parameters.put("001", "run value 1");
		parameters.put("002", "run value 2");
		
		job.build(parameters);
		
		job = jenkins.getJob(jobName);
		//assertTrue(job.getBuilds().size() == 1);
	}

	@Test
	public void shouldReturnBuildsForJob() throws Exception {
		JobWithDetails job = jenkins.getJobs().get(JENKINS_TEST_JOB).details();
		assertEquals(1, job.getBuilds().get(0).getNumber());
	}

}
