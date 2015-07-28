package minium.developer.web.version;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonIgnoreProperties(ignoreUnknown = true)
public class Release {

    @JsonProperty
    private String id;
    @JsonProperty("tag_name")
    private String tagName;
    @JsonProperty("html_url")
    private String htmlUrl;

    public Release() {
    }

    public Release(String tagName, String htmlUrl) {
        this.tagName = tagName;
        this.htmlUrl = htmlUrl;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getTagName() {
        return tagName;
    }

    public void setTagName(String tagName) {
        this.tagName = tagName;
    }

    public String getHtmlUrl() {
        return htmlUrl;
    }

    public void setHtmlUrl(String htmlUrl) {
        this.htmlUrl = htmlUrl;
    }

    public Release(String id, String tagName, String htmlUrl) {
        super();
        this.id = id;
        this.tagName = tagName;
        this.htmlUrl = htmlUrl;
    }

}
