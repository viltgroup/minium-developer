package minium.pupino.jenkins;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.io.UnsupportedEncodingException;
import java.nio.charset.StandardCharsets;

import javax.xml.bind.JAXBContext;
import javax.xml.bind.JAXBException;
import javax.xml.bind.Marshaller;
import javax.xml.bind.Unmarshaller;

import minium.pupino.beans.ArtifactArchiver;
import minium.pupino.beans.BranchSpec;
import minium.pupino.beans.Branches;
import minium.pupino.beans.Locations;
import minium.pupino.beans.MavenJobConfiguration;
import minium.pupino.beans.Publishers;
import minium.pupino.beans.RemoteConfigPlugin;
import minium.pupino.beans.SCMGit;
import minium.pupino.beans.SCMSubVersion;
import minium.pupino.beans.SubversionSCM;
import minium.pupino.beans.Triggers;
import minium.pupino.beans.UserRemoteConfigs;
import minium.pupino.web.rest.dto.BrowsersDTO;

public class JenkinsJobConfigurator {

	private MavenJobConfiguration config;

	public JenkinsJobConfigurator() {
		config = new MavenJobConfiguration();
	}

	public String getXMLSource(String scmType, String repository) throws UnsupportedEncodingException, JAXBException {
		this.generateConfiguration(scmType, repository);
		return this.generateXml(this.config);
	}

	public MavenJobConfiguration getObject(String xml) throws JAXBException {
		return this.generateObject(xml);
	}

	public String getXMl(MavenJobConfiguration mavenConfiguration) throws JAXBException, UnsupportedEncodingException {
		return this.generateXml(mavenConfiguration);
	}

	private void generateConfiguration(String scmType, String repository) {
		config.setDescription("Descricao");
		config.setGoals("clean install -U -Dremote.web.driver.url=http://silenus.vilt-group.com:4444/wd/hub -Dcucumber.options='--format json:result.json'");
		config.setJdk("java1.7");

		config.setAggregatorStyleBuild("true");
		config.setIncrementalBuild("false");
		config.setArchivingDisabled("true");
		config.setArchivingDisabled("false");
		config.setSiteArchivingDisabled("false");
		config.setFingerprintingDisabled("false");
		config.setResolveDependencies("false");
		config.setProcessPlugins("false");
		config.setMavenValidationLevel("-1");
		config.setRunHeadless("false");
		config.setDisableTriggerDownstreamProjects("false");
		config.setBlockTriggerWhenBuilding("true");

		if (scmType.equals("GIT")) {
			SCMGit scm = new SCMGit();
			scm.setConfigVersion("2");

			Branches branches = new Branches();
			BranchSpec brancheSpec = new BranchSpec();
			brancheSpec.setName("*/master");
			branches.setBranchSpec(brancheSpec);

			UserRemoteConfigs usersRemoteConfigs = new UserRemoteConfigs();
			RemoteConfigPlugin hudson = new RemoteConfigPlugin();
			hudson.setCredentialsId("b5a5497f-f3a8-453a-93ea-99eef6bb765e");
			hudson.setUrl(repository);
			usersRemoteConfigs.setHudson(hudson);
			scm.setRemoteConfig(usersRemoteConfigs);
			scm.setBranch(branches);
			SCMGit.SubModule submoduleCfg = new SCMGit.SubModule();
			scm.setSubmoduleCfg(submoduleCfg);

			config.setScm(scm);
		} else if (scmType.equals("SUBVERSION")) {
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

		// RootModule rootModule = new RootModule();
		// rootModule.setArtifactId("pt.cp");
		// rootModule.setGroupId("cp-e2e-tests");

		// config.setRootModule(rootModule);

		Publishers publishers = new Publishers();
		ArtifactArchiver artifact = new ArtifactArchiver();
		artifact.setAllowEmptyArchive("false");
		artifact.setArtifacts("result.json");
		artifact.setDefaultExcludes("true");
		artifact.setFingerprint("false");
		artifact.setOnlyIfSuccessful("false");
		publishers.setArtifact(artifact);

		config.setPublishers(publishers);
	}

	private String generateXml(MavenJobConfiguration config) throws JAXBException, UnsupportedEncodingException {

		JAXBContext jc = JAXBContext.newInstance(MavenJobConfiguration.class);

		ByteArrayOutputStream os = new ByteArrayOutputStream();

		Marshaller marshaller = jc.createMarshaller();
		marshaller.setProperty(Marshaller.JAXB_FORMATTED_OUTPUT, true);
		marshaller.marshal(config, os);

		String xmlSource = new String(os.toByteArray(), "UTF-8");

		return xmlSource;
	}

	private MavenJobConfiguration generateObject(String xml) throws JAXBException {
		JAXBContext jc = JAXBContext.newInstance(MavenJobConfiguration.class);

		Unmarshaller unmarshaller = jc.createUnmarshaller();
		InputStream stream = new ByteArrayInputStream(xml.getBytes(StandardCharsets.UTF_8));

		MavenJobConfiguration jobConfig = (MavenJobConfiguration) unmarshaller.unmarshal(stream);

		return jobConfig;
	}

	public String updateJobConfig(String jobConfig, String paramToUpdate,BrowsersDTO buildConfig) throws JAXBException, UnsupportedEncodingException {
		String updatedXml;
		String configs = config2String(buildConfig);
		switch (paramToUpdate) {
			case "goals":
				updatedXml = updateGoals(jobConfig,configs);
				break;
			default:
				updatedXml = updateGoals(jobConfig,configs);
		}
		return updatedXml;

	}

	private String updateGoals(String jobConfig,String configs) throws JAXBException, UnsupportedEncodingException {
		MavenJobConfiguration object = this.getObject(jobConfig);
		String goals = object.getGoals();
		StringBuilder updatedGoals = new StringBuilder();

		updatedGoals.append(goals);
		updatedGoals.append(configs);

		object.setGoals(updatedGoals.toString());
		String updatedXml = this.getXMl(object);

		return updatedXml;
	}
	
	private String config2String(BrowsersDTO buildConfig){
		StringBuilder sb = new StringBuilder();
		sb.append("-Ddesirecapabilities="+ buildConfig.getBrowsers());
		return sb.toString();
	}

}
