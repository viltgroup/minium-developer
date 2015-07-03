package minium.developer.utils;

import java.io.File;

import org.jboss.logging.Logger;

import com.google.common.base.Throwables;

public class Unzipper {
    private static Logger logger = Logger.getLogger(Unzipper.class);

    private final static String TMP_FILE = "tmp.tar";

    public static boolean unzip(String source, String destination) {
        try {
            File archive = new File(source);
            File outputDir = new File(destination);
            ZipUtils.unzipArchive(archive, outputDir);
            archive.delete();
        } catch (Exception e) {
            throw Throwables.propagate(e);
        }
        return true;
    }

    public static boolean untar(String source, String destination) {
        try {
            File archive = new File(source);
            File outputDir = new File(destination);
            TarUtils.untar(archive, outputDir);
            archive.delete();
            new File(outputDir, TMP_FILE).delete();
        } catch (Exception e) {
            throw Throwables.propagate(e);
        }
        return true;
    }

}