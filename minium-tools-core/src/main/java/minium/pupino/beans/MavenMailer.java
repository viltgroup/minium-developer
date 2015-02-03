package minium.pupino.beans;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;

@XmlAccessorType(XmlAccessType.FIELD)
public class MavenMailer {
	
	String recipients;
	String dontNotifyEveryUnstableBuild;
	String sendToIndividuals;
	String perModuleEmail;
	
	public String getRecipients() {
		return recipients;
	}
	public void setRecipients(String recipients) {
		this.recipients = recipients;
	}
	public String getDontNotifyEveryUnstableBuild() {
		return dontNotifyEveryUnstableBuild;
	}
	public void setDontNotifyEveryUnstableBuild(String dontNotifyEveryUnstableBuild) {
		this.dontNotifyEveryUnstableBuild = dontNotifyEveryUnstableBuild;
	}
	public String getSendToIndividuals() {
		return sendToIndividuals;
	}
	public void setSendToIndividuals(String sendToIndividuals) {
		this.sendToIndividuals = sendToIndividuals;
	}
	public String getPerModuleEmail() {
		return perModuleEmail;
	}
	public void setPerModuleEmail(String perModuleEmail) {
		this.perModuleEmail = perModuleEmail;
	}

}
