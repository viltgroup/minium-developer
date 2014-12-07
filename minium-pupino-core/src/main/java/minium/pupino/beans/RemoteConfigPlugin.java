package minium.pupino.beans;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;
import javax.xml.bind.annotation.XmlType;

@XmlRootElement(name = "hudson.plugins.git.UserRemoteConfig")
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "hudson.plugins.git.UserRemoteConfig", propOrder = {"url","credentialsId"})
public class RemoteConfigPlugin {
	
	@XmlElement
	String url;
	@XmlElement
	String credentialsId;
	
	public String getUrl() {
		return url;
	}
	public void setUrl(String url) {
		this.url = url;
	}
	public String getCredentialsId() {
		return credentialsId;
	}
	public void setCredentialsId(String credentialsId) {
		this.credentialsId = credentialsId;
	}
}
