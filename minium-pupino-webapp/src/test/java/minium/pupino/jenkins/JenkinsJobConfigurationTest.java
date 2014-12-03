package minium.pupino.jenkins;

import static org.junit.Assert.assertTrue;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;

import javax.xml.bind.JAXBContext;
import javax.xml.bind.JAXBException;
import javax.xml.bind.Marshaller;

import minium.pupino.beans.ArtifactArchiver;
import minium.pupino.beans.BranchSpec;
import minium.pupino.beans.Branches;
import minium.pupino.beans.Locations;
import minium.pupino.beans.MavenJobConfiguration;
import minium.pupino.beans.Publishers;
import minium.pupino.beans.RemoteConfigPlugin;
import minium.pupino.beans.RootModule;
import minium.pupino.beans.SCMGit;
import minium.pupino.beans.SCMSubVersion;
import minium.pupino.beans.SubversionSCM;
import minium.pupino.beans.Triggers;
import minium.pupino.beans.UserRemoteConfigs;

import org.apache.commons.io.FileUtils;
import org.apache.commons.lang3.RandomStringUtils;
import org.junit.Test;

import com.offbytwo.jenkins.JenkinsServer;

public class JenkinsJobConfigurationTest {
	private JenkinsServer jenkins;

	private static final String JENKINS_TEST_JOB = "cp-e2e-test";
	private static final String uri = "https://hestia.vilt-group.com/";
	private static final String uri2 = "http://lw255:8080/jenkins/";

	// @Test
	public void shoulGetJobByName() throws Exception {
		String source = jenkins.getJobXml(JENKINS_TEST_JOB);
	}

	// @Test
	public void shoulCreateJobWithConfig() throws Exception {
		final String description = "test-random";
		jenkins = new JenkinsServer(new URI(uri));
		String source = jenkins.getJobXml("cp-e2e-test");
		String newXml = source.replaceAll("<description>.*</description>", "<description>" + description + "</description>");

		jenkins.updateJob("cp-e2e-test", newXml);

		String confirmXml = jenkins.getJobXml(JENKINS_TEST_JOB);

		assertTrue(confirmXml.contains(description));

		// jenkins.createJob("simple110", config.getConfigXml());
	}

	//@Test
	public void shouldGetJobWithAuth() throws URISyntaxException, IOException {
		jenkins = new JenkinsServer(new URI(uri), "raphael.rodrigues", "Raphaeljr28");
		String source = jenkins.getJobXml("mpay-trunk-sonar");
	}

	@Test
	public void shouldGetJobXml() throws URISyntaxException, IOException, JAXBException {
		jenkins = new JenkinsServer(new URI(uri2));
		String ss1 = jenkins.getJobXml("cp-from-pupino");
		String source = jenkins.getJobXml("cp-e2e-test");
		
		JenkinsJobConfigurator conf = new JenkinsJobConfigurator();
		ss1 = conf.getXMLSource("GIT", "git@artemis.vilt-group.com:raphael.rodrigues/cp-e2e-tests.git");
		
		jenkins.createJob("cenas8", ss1);
		//jenkins.updateJob("cenas", source);
	}

	//@Test
	public void getXMl() throws Exception {
		JAXBContext jc = JAXBContext.newInstance(MavenJobConfiguration.class);
		
		String scm__type = "git";
		//JobConfiguration config = new JobConfiguration("","false","","Descricao","true","","true","false","false","false","java1.7","","false","true","false","false","false","false","false","false","false","-1","false","false","true","","","","","","",null);
		MavenJobConfiguration config = new MavenJobConfiguration();
		config.setDescription("Descricao");
		config.setGoals("clean install -U -Dremote.web.driver.url=http://silenus.vilt-group.com:4444/wd/hub -Dcucumber.options='--format json:result.json'");
		config.setJdk("java1.7");
		
		if( scm__type.equals("git")){
			SCMGit scm = new SCMGit();
			scm.setConfigVersion("2");
			
			
			Branches branches = new Branches();
			BranchSpec brancheSpec = new BranchSpec();
			brancheSpec.setName("*/master");
			branches.setBranchSpec(brancheSpec);
			
			UserRemoteConfigs usersRemoteConfigs = new UserRemoteConfigs();
			RemoteConfigPlugin hudson = new RemoteConfigPlugin();
			hudson.setCredentialsId("b5a5497f-f3a8-453a-93ea-99eef6bb765e");
			hudson.setUrl("git@artemis.vilt-group.com:raphael.rodrigues/cp-e2e-tests.git");
			usersRemoteConfigs.setHudson(hudson);
			scm.setRemoteConfig(usersRemoteConfigs);
			scm.setBranch(branches);
			SCMGit.SubModule submoduleCfg = new SCMGit.SubModule();
			scm.setSubmoduleCfg(submoduleCfg);
			
			config.setScm(scm);
		}else{
			SCMSubVersion scmSvn = new SCMSubVersion();
			
			scmSvn.setExcludedCommitMessages("");
			scmSvn.setExcludedRegions("");
			scmSvn.setExcludedRevprop("");
			scmSvn.setFilterChangelog("false");
			scmSvn.setIgnoreDirPropChanges("false");
			scmSvn.setIncludedRegions("");
			scmSvn.setExcludedUsers("");
			
			SCMSubVersion.WorkspaceUpdater updater = new SCMSubVersion.WorkspaceUpdater();
			scmSvn.setWorkspaceUpdater(updater);
			
			Locations locations = new Locations();
			
			SubversionSCM subversionSCM = new SubversionSCM();
			subversionSCM.setRemote("https://svn.vilt-group.com/svn/cgd/trunk/mpay");
			subversionSCM.setCredentialsId("6e2921d3-3060-460a-a98d-d96ec3e844ca");
			subversionSCM.setDepthOption("infinity");
			subversionSCM.setIgnoreExternalsOption("false");
			
			locations.setHudson(subversionSCM);
			scmSvn.setLocations(locations);
			
			config.setScmSubVersion(scmSvn);
		}
		
		
		Triggers triggers = new Triggers();
		Triggers.TimerTrigger timerTrigger = new Triggers.TimerTrigger();
		timerTrigger.setSpec("0 1 * * *");
		triggers.setTimerTrigger(timerTrigger);
		
		config.setTriggers(triggers);
		
		RootModule rootModule = new RootModule();
		rootModule.setArtifactId("pt.cp");
		rootModule.setGroupId("cp-e2e-tests");
		
		config.setRootModule(rootModule);
		
		
		Publishers publishers = new Publishers();
		ArtifactArchiver artifact = new ArtifactArchiver();
		artifact.setAllowEmptyArchive("false");
		artifact.setArtifacts("result.json");
		artifact.setDefaultExcludes("true");
		artifact.setFingerprint("false");
		artifact.setOnlyIfSuccessful("false");
		publishers.setArtifact(artifact);
		
		config.setPublishers(publishers);
		
		ByteArrayOutputStream os = new ByteArrayOutputStream();

		Marshaller marshaller = jc.createMarshaller();
		marshaller.setProperty(Marshaller.JAXB_FORMATTED_OUTPUT, true);
		marshaller.marshal(config, os);

		String aString = new String(os.toByteArray(), "UTF-8");
		
		jenkins = new JenkinsServer(new URI(uri2));
		String name = "job-" + RandomStringUtils.randomAlphabetic(2);
		//jenkins.getJob("job-jp");
		jenkins.updateJob("job-jp", aString);
		
		String source = jenkins.getJobXml(name);
		
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
