package minium.pupino.beans;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlType;

@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "", propOrder = {"artifact"})
public class Publishers {

	@XmlElement(name="hudson.tasks.ArtifactArchiver")
	ArtifactArchiver artifact;

	public ArtifactArchiver getArtifact() {
		return artifact;
	}

	public void setArtifact(ArtifactArchiver artifact) {
		this.artifact = artifact;
	}

	
	
}
