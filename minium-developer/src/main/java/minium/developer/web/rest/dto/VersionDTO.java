package minium.developer.web.rest.dto;

public class VersionDTO {

    private String version;
    private String date;
    private String commitHash;

    public VersionDTO(String version, String date, String commitHash) {
        super();
        this.version = version;
        this.date = date;
        this.commitHash = commitHash;
    }

    public String getVersion() {
        return version;
    }

    public void setVersion(String version) {
        this.version = version;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public String getCommitHash() {
        return commitHash;
    }

    public void setCommitHash(String commitHash) {
        this.commitHash = commitHash;
    }

}
