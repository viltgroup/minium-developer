package minium.pupino.domain;

import java.io.Serializable;

public class SourceRepository implements Serializable {

	public enum Type {
		GIT, SUBVERSION
	}

	private static final long serialVersionUID = -9208048124705391941L;

	private Type type;

	private String url;

	public Type getType() {
		return type;
	}

	public void setType(Type type) {
		this.type = type;
	}

	public String getUrl() {
		return url;
	}

	public void setUrl(String url) {
		this.url = url;
	}
}
