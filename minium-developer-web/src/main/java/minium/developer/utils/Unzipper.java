package minium.developer.utils;

import java.io.File;

import org.rauschig.jarchivelib.ArchiveFormat;
import org.rauschig.jarchivelib.Archiver;
import org.rauschig.jarchivelib.ArchiverFactory;
import org.rauschig.jarchivelib.CompressionType;

import minium.internal.Throwables;

public class Unzipper {

    private Unzipper() {

    }

    private static void extractArchive(Archiver archiver, File archive, String destination) {
        try {
            File outputDir = new File(destination);
            archiver.extract(archive, outputDir);
            archive.delete();
        } catch (Exception e) {
            throw Throwables.propagate(e);
        }
    }

    public static void unzip(File archive, String destination) {
        extractArchive(ArchiverFactory.createArchiver(ArchiveFormat.ZIP), archive, destination);
    }

    public static void untar(File archive, CompressionType type, String destination) {
        extractArchive(ArchiverFactory.createArchiver(ArchiveFormat.TAR, type), archive, destination);
    }
}