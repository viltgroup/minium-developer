package minium.tools.fs.domain;

import java.io.Serializable;

public class FileContent implements Serializable {

    private static final long serialVersionUID = 6269762730321965510L;

    private FileProps fileProps;

    private String content;

    public FileContent() {
    }

    public FileContent(FileProps fileProps, String content) {
        this.fileProps = fileProps;
        this.content = content;
    }

    public FileProps getFileProps() {
        return fileProps;
    }

    public void setFileProps(FileProps fileProps) {
        this.fileProps = fileProps;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    @Override
    public String toString() {
        return fileProps.toString();
    }
}