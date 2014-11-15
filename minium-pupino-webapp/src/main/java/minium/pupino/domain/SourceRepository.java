package minium.pupino.domain;

import java.io.Serializable;
import java.net.URI;

public class SourceRepository implements Serializable {

	public enum Type {
		GIT, SUBVERSION
	}

	private static final long serialVersionUID = -9208048124705391941L;

	private Type type;

	private URI url;

	public Type getType() {
		return type;
	}

	public void setType(Type type) {
		this.type = type;
	}

	public URI getUrl() {
		return url;
	}

	public void setUrl(URI url) {
		this.url = url;
	}
}
