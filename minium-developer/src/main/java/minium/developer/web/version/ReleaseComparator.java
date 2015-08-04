package minium.developer.web.version;

import java.io.Serializable;
import java.util.Comparator;

public class ReleaseComparator implements Comparator<Release>, Serializable {

    /**
     *
     * @return 1 if the second release is considered newer than the first
     */
    @Override
    public int compare(final Release release1, final Release release2) {

        String release1Version = stripVersion(release1.getTagName());
        String release2Version = stripVersion(release2.getTagName());

        return release1Version.compareTo(release2Version);
    }

    private String stripVersion(final String tagName) {
        return tagName.replaceFirst("minium-tools-", "").replaceAll("-\\w*", "");
    }
}
