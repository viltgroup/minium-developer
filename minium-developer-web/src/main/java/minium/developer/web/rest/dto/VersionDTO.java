package minium.developer.web.rest.dto;

public class VersionDTO {

    private String version;
    private String date;
    private String commitHash;
    private boolean hasNewVersion;
    private String linkForNewVersion;

    public VersionDTO(String version, String date, String commitHash) {
        super();
        this.version = version;
        this.date = date;
        this.commitHash = commitHash;
    }

    public VersionDTO(String version, String date, String commitHash, boolean hasNewVersion, String linkForNewVersion) {
        super();
        this.version = version;
        this.date = date;
        this.commitHash = commitHash;
        this.hasNewVersion = hasNewVersion;
        this.linkForNewVersion = linkForNewVersion;
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

    public boolean isHasNewVersion() {
        return hasNewVersion;
    }

    public void setHasNewVersion(boolean hasNewVersion) {
        this.hasNewVersion = hasNewVersion;
    }

    public String getLinkForNewVersion() {
        return linkForNewVersion;
    }

    public void setLinkForNewVersion(String linkForNewVersion) {
        this.linkForNewVersion = linkForNewVersion;
    }

}
