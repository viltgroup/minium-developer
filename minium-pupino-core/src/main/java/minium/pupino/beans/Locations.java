package minium.pupino.beans;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

@XmlRootElement(name = "scm")
@XmlAccessorType(XmlAccessType.FIELD)
public class Locations {
	
	@XmlElement(name="hudson.scm.SubversionSCM_-ModuleLocation")
	SubversionSCM hudson;

	public SubversionSCM getHudson() {
		return hudson;
	}

	public void setHudson(SubversionSCM hudson) {
		this.hudson = hudson;
	}
	
}
