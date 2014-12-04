package minium.pupino.beans;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlType;

@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "branches", propOrder = {"branchSpec"})
public class Branches {
	@XmlElement(name="hudson.plugins.git.BranchSpec")
	BranchSpec branchSpec;

	public BranchSpec getBranchSpec() {
		return branchSpec;
	}

	public void setBranchSpec(BranchSpec branchSpec) {
		this.branchSpec = branchSpec;
	}
	
}
