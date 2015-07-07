package minium.developer.utils;

import java.io.File;

import com.google.common.base.Throwables;

public class Unzipper {

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
        } catch (Exception e) {
            throw Throwables.propagate(e);
        }
        return true;
    }

}