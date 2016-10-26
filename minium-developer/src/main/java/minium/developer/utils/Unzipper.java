package minium.developer.utils;

import java.io.File;

import com.google.common.base.Throwables;

public class Unzipper {

    private Unzipper() {

    }

    public static void unzip(String source, String destination) {
        try {
            File archive = new File(source);
            File outputDir = new File(destination);
            ZipUtils.unzipArchive(archive, outputDir);
            archive.delete();
        } catch (Exception e) {
            throw Throwables.propagate(e);
        }
    }

    public static void untar(String source, String destination) {
        try {
            File archive = new File(source);
            File outputDir = new File(destination);
            TarUtils.untar(archive, outputDir);
            archive.delete();
        } catch (Exception e) {
            throw Throwables.propagate(e);
        }
    }

    public static void unzip(File archive, String destination) {
        unzip(archive.getAbsolutePath(), destination);
    }

    public static void untar(File archive, String destination) {
        untar(archive.getAbsolutePath(), destination);
    }

    public static void extractArchive(File archive, String destination) {
        String path = archive.getAbsolutePath();
        if (path.endsWith(".zip")) {
            unzip(path, destination);
        } else if (path.endsWith(".tar.gz")) {
            untar(path, destination);
        }
    }
}