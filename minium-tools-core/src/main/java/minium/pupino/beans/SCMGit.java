package minium.pupino.beans;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlAttribute;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlType;

@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "", propOrder = {"configVersion","userRemoteConfigs","branches","submoduleCfg"})
public class SCMGit {
	@XmlAttribute
	String plugin = "git@2.3";
	
	@XmlAttribute(name="class")
	String class_name = "hudson.plugins.git.GitSCM";
	
	@XmlElement
    String configVersion;
	
	@XmlElement(required = true)
	UserRemoteConfigs userRemoteConfigs;
	
	@XmlElement
	Branches branches;
	
	@XmlElement(required = true)
	SCMGit.SubModule submoduleCfg;
	
	public static class SubModule{
		@XmlAttribute
		String class_name = "list";
		
	}
	
	public String getConfigVersion() {
		return configVersion;
	}
	
	public void setConfigVersion(String configVersion) {
		this.configVersion = configVersion;
	}

	public UserRemoteConfigs getRemoteConfig() {
		return userRemoteConfigs;
	}

	public void setRemoteConfig(UserRemoteConfigs remoteConfig) {
		this.userRemoteConfigs = remoteConfig;
	}

	public Branches getBranch() {
		return branches;
	}

	public void setBranch(Branches branch) {
		this.branches = branch;
	}

	public SCMGit.SubModule getSubmoduleCfg() {
		return submoduleCfg;
	}

	public void setSubmoduleCfg(SCMGit.SubModule submoduleCfg) {
		this.submoduleCfg = submoduleCfg;
	}
}