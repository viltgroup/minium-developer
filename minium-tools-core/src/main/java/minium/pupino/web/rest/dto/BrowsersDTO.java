package minium.pupino.web.rest.dto;


public class BrowsersDTO {

	private boolean chrome;
	private boolean firefox;
	private boolean ie;
	private boolean opera;

	public BrowsersDTO() {
		super();
	}

	public String getBrowsers() {
		StringBuilder sb = new StringBuilder();
		if(chrome) sb.append("chromedriver ");
		if(firefox)  sb.append("firefox ");
		if(ie) sb.append("internet explorer ");
		if(opera) sb.append("opera ");
		
		return sb.toString();
	}

	public boolean isChrome() {
		return chrome;
	}

	public void setChrome(boolean chrome) {
		this.chrome = chrome;
	}

	public boolean isFirefox() {
		return firefox;
	}

	public void setFirefox(boolean firefox) {
		this.firefox = firefox;
	}

	public boolean isIe() {
		return ie;
	}

	public void setIe(boolean ie) {
		this.ie = ie;
	}

	public boolean isOpera() {
		return opera;
	}

	public void setOpera(boolean opera) {
		this.opera = opera;
	}

}
