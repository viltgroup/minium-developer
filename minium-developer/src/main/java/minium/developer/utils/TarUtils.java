package minium.developer.utils;

import java.io.BufferedInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;

import org.apache.commons.compress.archivers.ArchiveEntry;
import org.apache.commons.compress.archivers.tar.TarArchiveInputStream;
import org.apache.commons.compress.compressors.bzip2.BZip2CompressorInputStream;

/**
 *
 * The utility class is responsible for unpacking tar or tar.gz packages. The
 * class uses <a href="http://commons.apache.org/compress/">Apache Commons
 * Compress</a> library.
 *
 * @author johnkil
 *
 */
public class TarUtils {

    public static void untar(File tarFile, File outputDir) throws IOException {


        untarBZ2(tarFile, outputDir);
        TarArchiveInputStream tarArchiveInputStream = new TarArchiveInputStream(new FileInputStream(new File(outputDir, "tmp.tar")));
        try {
            ArchiveEntry tarEntry = tarArchiveInputStream.getNextEntry();
            while (tarEntry != null) {
                File destPath = new File(outputDir, tarEntry.getName());
                if (!tarEntry.isDirectory()) {
                    FileOutputStream fout = new FileOutputStream(destPath);
                    final byte[] buffer = new byte[8192];
                    int n = 0;
                    while (-1 != (n = tarArchiveInputStream.read(buffer))) {
                        fout.write(buffer, 0, n);
                    }
                    fout.close();
                } else {
                    destPath.mkdir();
                }
                tarEntry = tarArchiveInputStream.getNextEntry();
            }
        } finally {
            tarArchiveInputStream.close();
        }
    }

    public static void untarBZ2(File tarFile, File outputDir) throws IOException {

        if ( !outputDir.exists() ) {
            createDir(outputDir);
        }

        FileInputStream fin = new FileInputStream(tarFile);
        BufferedInputStream in = new BufferedInputStream(fin);
        FileOutputStream out = new FileOutputStream(new File(outputDir, "tmp.tar"));
        BZip2CompressorInputStream bzIn = new BZip2CompressorInputStream(in);
        final byte[] buffer = new byte[30000];
        int n = 0;
        while (-1 != (n = bzIn.read(buffer))) {
            out.write(buffer, 0, n);
        }
        out.close();
        bzIn.close();
    }

    private static void createDir(File dir) {
        if (!dir.mkdirs())
            throw new RuntimeException("Can not create dir " + dir);
    }
}
