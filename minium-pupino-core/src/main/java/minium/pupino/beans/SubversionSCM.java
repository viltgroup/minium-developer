package minium.pupino.beans;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;


@XmlAccessorType(XmlAccessType.FIELD)
public class SubversionSCM {
	
	@XmlElement
	String remote;
	@XmlElement
	String credentialsId;
	@XmlElement
	String depthOption;
	@XmlElement
	String ignoreExternalsOption;
	
	public String getRemote() {
		return remote;
	}
	public void setRemote(String remote) {
		this.remote = remote;
	}
	public String getCredentialsId() {
		return credentialsId;
	}
	public void setCredentialsId(String credentialsId) {
		this.credentialsId = credentialsId;
	}
	public String getDepthOption() {
		return depthOption;
	}
	public void setDepthOption(String depthOption) {
		this.depthOption = depthOption;
	}
	public String getIgnoreExternalsOption() {
		return ignoreExternalsOption;
	}
	public void setIgnoreExternalsOption(String ignoreExternalsOption) {
		this.ignoreExternalsOption = ignoreExternalsOption;
	}
	
	
}
