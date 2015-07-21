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
    // @JsonFormat(shape = JsonFormat.Shape.STRING, pattern =
    // "yyyy-MM-dd'T'HH:mm:ssZ")
    // @JsonProperty("published_at")
    // private DateTime publishedAt;

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

    // public DateTime getPublishedAt() {
    // return publishedAt;
    // }
    //
    // public void setPublishedAt(DateTime publishedAt) {
    // this.publishedAt = publishedAt;
    // }
}
