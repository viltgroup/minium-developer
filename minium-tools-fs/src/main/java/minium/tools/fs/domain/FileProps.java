package minium.tools.fs.domain;

import java.io.Serializable;
import java.net.URI;
import java.util.Date;

public class FileProps implements Serializable {

    private static final long serialVersionUID = 3814816545727988305L;

    public enum Type {
        FILE, DIR, SYMLINK
    };

    private String name;
    private URI uri;
    private URI relativeUri;
    private String absoluteUri;
    private long size;
    private FileProps.Type type;
    private Date lastModified;
    private int lineNo;
    private boolean preview;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public URI getUri() {
        return uri;
    }

    public void setUri(URI uri) {
        this.uri = uri;
    }

    public URI getRelativeUri() {
        return relativeUri;
    }

    public void setRelativeUri(URI relativeUri) {
        this.relativeUri = relativeUri;
    }

    public long getSize() {
        return size;
    }

    public void setSize(long size) {
        this.size = size;
    }

    public FileProps.Type getType() {
        return type;
    }

    public void setType(FileProps.Type type) {
        this.type = type;
    }

    public Date getLastModified() {
        return lastModified;
    }

    public void setLastModified(Date lastModified) {
        this.lastModified = lastModified;
    }

    @Override
    public String toString() {
        return uri.toString();
    }

    public int getLineNo() {
        return lineNo;
    }

    public void setLineNo(int lineNo) {
        this.lineNo = lineNo;
    }

    public String getAbsoluteUri() {
        return absoluteUri;
    }

    public void setAbsoluteUri(String absoluteUri) {
        this.absoluteUri = absoluteUri;
    }

    public boolean getPreview() {
        return preview;
    }

    public void setPreview(boolean preview) {
        this.preview = preview;
    }
}