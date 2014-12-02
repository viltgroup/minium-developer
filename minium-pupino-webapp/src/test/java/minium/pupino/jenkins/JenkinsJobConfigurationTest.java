package minium.pupino.jenkins;

import static org.junit.Assert.assertTrue;

import java.io.File;
import java.io.IOException;
import java.net.URI;

import org.apache.commons.io.FileUtils;
import org.junit.Test;

import com.offbytwo.jenkins.JenkinsServer;


public class JenkinsJobConfigurationTest {
	private JenkinsServer jenkins;

	private static final String JENKINS_TEST_JOB = "cp-e2e-test";
	private static final String uri = "https://hestia.vilt-group.com/";

	
	//@Test
	public void shoulGetJobByName() throws Exception {
		String source = jenkins.getJobXml(JENKINS_TEST_JOB);
	}
	
	//@Test
	public void shoulCreateJobWithConfig() throws Exception {
		final String description = "test-random";
		jenkins = new JenkinsServer(new URI(uri));
		String source = jenkins.getJobXml("cp-e2e-test");
		String newXml = source.replaceAll("<description>.*</description>", "<description>" + description+ "</description>");
		
		jenkins.updateJob("cp-e2e-test", newXml);
		
		String confirmXml = jenkins.getJobXml(JENKINS_TEST_JOB);
		
		assertTrue(confirmXml.contains(description));
		
		//jenkins.createJob("simple110", config.getConfigXml());
	}
	
	@Test
	public void getXMl() throws Exception {
		final String description = "test-random";
		jenkins = new JenkinsServer(new URI(uri),"raphael.rodrigues","Raphaeljr28");
		String source = jenkins.getJobXml("mpay-trunk-sonar");
		
		jenkins = new JenkinsServer(new URI("http://lw255:8080/jenkins/"));
		jenkins.createJob("mpay", source);
	}
	
	private String fromXMLFile(String xmlFile) {
		File file = new File(xmlFile);
		String content = null;
		try {
			// Read the entire contents
			content = FileUtils.readFileToString(file);
		} catch (IOException e) {
			e.printStackTrace();
		}
		return content;

	}

}
