package minium.pupino.beans;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlType;

@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "hudson.tasks.ArtifactArchiver", propOrder = {"artifacts","allowEmptyArchive","onlyIfSuccessful","fingerprint","defaultExcludes"})
public class ArtifactArchiver {
	@XmlElement
	String artifacts;
	@XmlElement
	String allowEmptyArchive;
	@XmlElement
	String onlyIfSuccessful;
	@XmlElement
	String fingerprint;
	@XmlElement
	String defaultExcludes;
	
	public String getArtifacts() {
		return artifacts;
	}
	public void setArtifacts(String artifacts) {
		this.artifacts = artifacts;
	}
	public String getAllowEmptyArchive() {
		return allowEmptyArchive;
	}
	public void setAllowEmptyArchive(String allowEmptyArchive) {
		this.allowEmptyArchive = allowEmptyArchive;
	}
	public String getOnlyIfSuccessful() {
		return onlyIfSuccessful;
	}
	public void setOnlyIfSuccessful(String onlyIfSuccessful) {
		this.onlyIfSuccessful = onlyIfSuccessful;
	}
	public String getFingerprint() {
		return fingerprint;
	}
	public void setFingerprint(String fingerprint) {
		this.fingerprint = fingerprint;
	}
	public String getDefaultExcludes() {
		return defaultExcludes;
	}
	public void setDefaultExcludes(String defaultExcludes) {
		this.defaultExcludes = defaultExcludes;
	}

}
