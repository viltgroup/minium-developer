package minium.pupino.beans;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlType;

@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(propOrder = {"timerTrigger"})
public class Triggers {
	@XmlElement(name = "hudson.triggers.TimerTrigger")
	Triggers.TimerTrigger timerTrigger;
	
	@XmlAccessorType(XmlAccessType.FIELD)
	@XmlType( propOrder = {"spec"})
	public static class TimerTrigger{
		@XmlElement
		String spec;

		public String getSpec() {
			return spec;
		}

		public void setSpec(String spec) {
			this.spec = spec;
		}
	}

	public Triggers.TimerTrigger getTimerTrigger() {
		return timerTrigger;
	}

	public void setTimerTrigger(Triggers.TimerTrigger timerTrigger) {
		this.timerTrigger = timerTrigger;
	}
}
