package minium.pupino.beans;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlAttribute;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

@XmlRootElement(name = "scm")
@XmlAccessorType(XmlAccessType.FIELD)
public class SCMSubVersion {
	
	@XmlAttribute
	String plugin = "subversion@2.4.4";
	
	@XmlAttribute(name ="class")
	String class_name = "hudson.scm.SubversionSCM";
	
	@XmlElement
	Locations locations;
	
	@XmlElement
	String excludedRegions;
	@XmlElement
	String includedRegions;
	@XmlElement
	String excludedUsers;
	@XmlElement
	String excludedRevprop;
	@XmlElement
	String excludedCommitMessages;
	@XmlElement
	SCMSubVersion.WorkspaceUpdater workspaceUpdater;
	
	
	public static class WorkspaceUpdater{
		@XmlAttribute
		String class_name = "hudson.scm.subversion.UpdateWithCleanUpdater";
	}
	
	@XmlElement
	String ignoreDirPropChanges;
	@XmlElement
	String filterChangelog;
	
	public String getPlugin() {
		return plugin;
	}
	public void setPlugin(String plugin) {
		this.plugin = plugin;
	}
	public String getClass_name() {
		return class_name;
	}
	public void setClass_name(String class_name) {
		this.class_name = class_name;
	}
	public Locations getLocations() {
		return locations;
	}
	public void setLocations(Locations locations) {
		this.locations = locations;
	}
	public String getExcludedRegions() {
		return excludedRegions;
	}
	public void setExcludedRegions(String excludedRegions) {
		this.excludedRegions = excludedRegions;
	}
	public String getIncludedRegions() {
		return includedRegions;
	}
	public void setIncludedRegions(String includedRegions) {
		this.includedRegions = includedRegions;
	}
	public String getExcludedUsers() {
		return excludedUsers;
	}
	public void setExcludedUsers(String excludedUsers) {
		this.excludedUsers = excludedUsers;
	}
	public String getExcludedRevprop() {
		return excludedRevprop;
	}
	public void setExcludedRevprop(String excludedRevprop) {
		this.excludedRevprop = excludedRevprop;
	}
	public String getExcludedCommitMessages() {
		return excludedCommitMessages;
	}
	public void setExcludedCommitMessages(String excludedCommitMessages) {
		this.excludedCommitMessages = excludedCommitMessages;
	}
	public SCMSubVersion.WorkspaceUpdater getWorkspaceUpdater() {
		return workspaceUpdater;
	}
	public void setWorkspaceUpdater(SCMSubVersion.WorkspaceUpdater workspaceUpdater) {
		this.workspaceUpdater = workspaceUpdater;
	}
	public String getIgnoreDirPropChanges() {
		return ignoreDirPropChanges;
	}
	public void setIgnoreDirPropChanges(String ignoreDirPropChanges) {
		this.ignoreDirPropChanges = ignoreDirPropChanges;
	}
	public String getFilterChangelog() {
		return filterChangelog;
	}
	public void setFilterChangelog(String filterChangelog) {
		this.filterChangelog = filterChangelog;
	}
	
	
}
