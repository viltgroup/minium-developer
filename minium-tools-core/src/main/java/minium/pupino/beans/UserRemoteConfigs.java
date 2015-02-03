package minium.pupino.beans;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlType;

@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "", propOrder = {"hudson"})
public class UserRemoteConfigs{
	@XmlElement(name="hudson.plugins.git.UserRemoteConfig")
	RemoteConfigPlugin hudson;

	public RemoteConfigPlugin getHudson() {
		return hudson;
	}

	public void setHudson(RemoteConfigPlugin hudson) {
		this.hudson = hudson;
	}
	
}