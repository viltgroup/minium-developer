package minium.pupino.jenkins;

import java.net.URI;
import java.net.URISyntaxException;

import org.junit.Before;
import org.junit.Test;

import com.offbytwo.jenkins.JenkinsServer;

public class JenkinsJobConfigurationTest {
	private JenkinsServer jenkins;

	private static final String JENKINS_TEST_JOB = "test-example";
	private static final String uri = "http://lw255:8080/jenkins/";

	@Before
	public void setUp() throws URISyntaxException {
		jenkins = new JenkinsServer(new URI(uri), "admin", "admin");
	}

	@Test
	public void shoulGetJobByName() throws Exception {
		String source = jenkins.getJobXml(JENKINS_TEST_JOB);
	}
}
