package minium.pupino.beans;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlAttribute;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

@XmlRootElement(name = "maven2-moduleset")
@XmlAccessorType(XmlAccessType.FIELD)
public class MavenJobConfiguration {
	@XmlAttribute
	String plugin="maven-plugin@2.7";
			
	@XmlElement
	String description;
	
	@XmlElement
	SCMGit scm;
	
	@XmlElement(name="scm")
	SCMSubVersion scmSubVersion;
	
	@XmlElement
	String goals;
	
	@XmlElement
	String mavenOpts;
	
	@XmlElement
	String jdk;
	
	@XmlElement
	Triggers triggers;
	
	@XmlElement
	RootModule rootModule;
	
	@XmlElement
	Settings settings;
	
	@XmlElement
	String aggregatorStyleBuild;
	@XmlElement
	String incrementalBuild;
	@XmlElement
	String ignoreUpstremChanges;
	@XmlElement
	String archivingDisabled;
	@XmlElement
	String siteArchivingDisabled;
	@XmlElement
	String fingerprintingDisabled;
	@XmlElement
	String resolveDependencies;
	@XmlElement
	String processPlugins;
	@XmlElement
	String mavenValidationLevel;
	@XmlElement
	String runHeadless;
	@XmlElement
	String disableTriggerDownstreamProjects;
	@XmlElement
	String blockTriggerWhenBuilding;
	@XmlElement
	String globalSettings;
	@XmlElement
	String disabled;
	
	@XmlElement
	Reporter reporter;
	
	@XmlElement(required = true)
	Publishers publishers;
	
	
	public MavenJobConfiguration() {
	}

	public String getDescription() {
		return description;
	}
	
	public void setDescription(String description) {
		this.description = description;
	}

	public String getGoals() {
		return goals;
	}
	
	public void setGoals(String goals) {
		this.goals = goals;
	}

	public String getJdk() {
		return jdk;
	}

	public void setJdk(String jdk) {
		this.jdk = jdk;
	}

	public SCMGit getScm() {
		return scm;
	}

	public void setScm(SCMGit scm) {
		this.scm = scm;
	}

	public Publishers getPublishers() {
		return publishers;
	}

	public void setPublishers(Publishers publishers) {
		this.publishers = publishers;
	}

	public RootModule getRootModule() {
		return rootModule;
	}

	public void setRootModule(RootModule rootModule) {
		this.rootModule = rootModule;
	}

	public String getPlugin() {
		return plugin;
	}

	public void setPlugin(String plugin) {
		this.plugin = plugin;
	}

	public String getMavenOpts() {
		return mavenOpts;
	}

	public void setMavenOpts(String mavenOpts) {
		this.mavenOpts = mavenOpts;
	}

	public Triggers getTriggers() {
		return triggers;
	}

	public void setTriggers(Triggers triggers) {
		this.triggers = triggers;
	}

	public Settings getSettings() {
		return settings;
	}

	public void setSettings(Settings settings) {
		this.settings = settings;
	}

	public Reporter getReporter() {
		return reporter;
	}

	public void setReporter(Reporter reporter) {
		this.reporter = reporter;
	}

	public SCMSubVersion getScmSubVersion() {
		return scmSubVersion;
	}

	public void setScmSubVersion(SCMSubVersion scmSubVersion) {
		this.scmSubVersion = scmSubVersion;
	}

	public String getAggregatorStyleBuild() {
		return aggregatorStyleBuild;
	}

	public void setAggregatorStyleBuild(String aggregatorStyleBuild) {
		this.aggregatorStyleBuild = aggregatorStyleBuild;
	}

	public String getIncrementalBuild() {
		return incrementalBuild;
	}

	public void setIncrementalBuild(String incrementalBuild) {
		this.incrementalBuild = incrementalBuild;
	}

	public String getIgnoreUpstremChanges() {
		return ignoreUpstremChanges;
	}

	public void setIgnoreUpstremChanges(String ignoreUpstremChanges) {
		this.ignoreUpstremChanges = ignoreUpstremChanges;
	}

	public String getArchivingDisabled() {
		return archivingDisabled;
	}

	public void setArchivingDisabled(String archivingDisabled) {
		this.archivingDisabled = archivingDisabled;
	}

	public String getSiteArchivingDisabled() {
		return siteArchivingDisabled;
	}

	public void setSiteArchivingDisabled(String siteArchivingDisabled) {
		this.siteArchivingDisabled = siteArchivingDisabled;
	}

	public String getFingerprintingDisabled() {
		return fingerprintingDisabled;
	}

	public void setFingerprintingDisabled(String fingerprintingDisabled) {
		this.fingerprintingDisabled = fingerprintingDisabled;
	}

	public String getResolveDependencies() {
		return resolveDependencies;
	}

	public void setResolveDependencies(String resolveDependencies) {
		this.resolveDependencies = resolveDependencies;
	}

	public String getProcessPlugins() {
		return processPlugins;
	}

	public void setProcessPlugins(String processPlugins) {
		this.processPlugins = processPlugins;
	}

	public String getMavenValidationLevel() {
		return mavenValidationLevel;
	}

	public void setMavenValidationLevel(String mavenValidationLevel) {
		this.mavenValidationLevel = mavenValidationLevel;
	}

	public String getRunHeadless() {
		return runHeadless;
	}

	public void setRunHeadless(String runHeadless) {
		this.runHeadless = runHeadless;
	}

	public String getDisableTriggerDownstreamProjects() {
		return disableTriggerDownstreamProjects;
	}

	public void setDisableTriggerDownstreamProjects(String disableTriggerDownstreamProjects) {
		this.disableTriggerDownstreamProjects = disableTriggerDownstreamProjects;
	}

	public String getBlockTriggerWhenBuilding() {
		return blockTriggerWhenBuilding;
	}

	public void setBlockTriggerWhenBuilding(String blockTriggerWhenBuilding) {
		this.blockTriggerWhenBuilding = blockTriggerWhenBuilding;
	}

	public String getGlobalSettings() {
		return globalSettings;
	}

	public void setGlobalSettings(String globalSettings) {
		this.globalSettings = globalSettings;
	}

	public String getDisabled() {
		return disabled;
	}

	public void setDisabled(String disabled) {
		this.disabled = disabled;
	}
	
	
}
