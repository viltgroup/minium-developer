package minium.developer.web.version;

import static org.junit.Assert.assertTrue;

import org.junit.Before;
import org.junit.Test;

public class ReleaseComparatorTest {

    private ReleaseComparator releaseComparator;

    @Before
    public void setup() {
        releaseComparator = new ReleaseComparator();
    }

    @Test
    public void testReleaseIsTheOldest() {
        Release olderRelease = new Release("minium-tools-1.1.1", null);

        Release newRelease = new Release("minium-tools-1.2.1", null);

        int compare = releaseComparator.compare(olderRelease, newRelease);
        assertTrue("Relase 1.1.1 is older than 1.2.1", compare > 0);
    }

    @Test
    public void testReleaseIsNotNewest() {
        Release newRelease = new Release("minium-tools-1.1.0-SNAPSHOT", null);

        Release olderRelease = new Release("minium-tools-0.1.1", null);

        int compare = releaseComparator.compare(newRelease, olderRelease);
        assertTrue("Relase 1.1.0-SNAPSHOT is newer than 0.1.1", compare < 0);
    }

    @Test
    public void testReleaseIsNewer() {
        Release newRelease = new Release("minium-tools-1.1.3-SNAPSHOT", null);

        Release olderRelease = new Release("minium-tools-1.1.2", null);

        int compare = releaseComparator.compare(newRelease, olderRelease);
        assertTrue("Relase 1.1.3-SNAPSHOT is newer than 1.1.2", compare < 0);
    }

    @Test
    public void testReleaseIsNotOldest() {
        Release olderRelease = new Release("minium-tools-1.1.0", null);

        Release newRelease = new Release("minium-tools-1.1.1", null);

        int compare = releaseComparator.compare(olderRelease, newRelease);
        assertTrue("Relase 1.1.0 is odler than 1.1.1", compare > 0);
    }

    @Test
    public void testReleaseIsOldest() {
        Release olderRelease = new Release("minium-tools-3.1.6", null);

        Release newRelease = new Release("minium-tools-3.15", null);

        int compare = releaseComparator.compare(olderRelease, newRelease);
        assertTrue("Relase 3.1.6 is older than 3.15", compare > 0);
    }

    @Test
    public void testReleaseIsTheSame() {
        Release olderRelease = new Release("minium-tools-2.1.6", null);

        Release newRelease = new Release("minium-tools-2.1.6", null);

        int compare = releaseComparator.compare(olderRelease, newRelease);
        assertTrue("Relase 2.1.6 is the same than 2.1.6 ", compare == 0);
    }

    @Test
    public void testReleaseWithoutPrefix() {
        Release olderRelease = new Release("3.4.6", null);

        Release newRelease = new Release("3.5.1", null);

        int compare = releaseComparator.compare(olderRelease, newRelease);
        assertTrue("Relase 3.4.6 is newer than 3.5.1", compare > 0);
    }

}
