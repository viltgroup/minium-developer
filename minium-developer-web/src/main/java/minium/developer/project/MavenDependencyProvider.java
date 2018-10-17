package minium.developer.project;

import java.io.File;
import java.io.IOException;
import java.io.PrintStream;
import java.net.URL;
import java.util.Collection;
import java.util.List;

import org.apache.commons.io.FileUtils;
import org.apache.commons.io.filefilter.SuffixFileFilter;
import org.apache.maven.cli.MavenCli;
import org.apache.tomcat.util.http.fileupload.ByteArrayOutputStream;
import org.springframework.stereotype.Component;

import com.google.common.collect.Lists;
import com.google.common.io.Files;

@Component
public class MavenDependencyProvider {

    public static class MavenException extends Exception {
        public MavenException(String errorMessage) {
            super(errorMessage);
        }
    }

    public List<URL> getDependencies(File projectDir) throws MavenException, IOException {
        if (hasDependencies(projectDir)) {
            File dependencyDir = Files.createTempDir();
            copyDependencies(projectDir, dependencyDir);
            return getJarUrls(dependencyDir);
        } else {
            return Lists.newArrayList();
        }
    }

    private boolean hasDependencies(File projectDir) throws IOException {
        File pom = new File(projectDir, "pom.xml");
        return FileUtils.readFileToString(pom).contains("<dependencies>");
    }

    private void copyDependencies(File projectDir, File outputDir) throws MavenException, IOException {
        String projectPath = projectDir.getAbsolutePath();
        String previousMultiModuleProjectDirectory =
                System.setProperty(MavenCli.MULTIMODULE_PROJECT_DIRECTORY, projectPath);
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        PrintStream printStream = new PrintStream(outputStream);
        int mavenCliResult = new MavenCli().doMain(new String[] {
                "dependency:copy-dependencies",
                "-DexcludeTransitive=true",
                "-DexcludeGroupIds=io.vilt.minium,ch.qos.logback,org.seleniumhq.selenium",
                "-DoutputDirectory=" + outputDir.getAbsolutePath()
        }, projectPath, printStream, printStream);
        String mavenOutput = outputStream.toString();
        outputStream.close();

        if (previousMultiModuleProjectDirectory != null) {
            System.setProperty(MavenCli.MULTIMODULE_PROJECT_DIRECTORY, previousMultiModuleProjectDirectory);
        } else {
            System.clearProperty(MavenCli.MULTIMODULE_PROJECT_DIRECTORY);
        }

        if (mavenCliResult != 0) throw new MavenException(mavenOutput);
    }

    private List<URL> getJarUrls(File dir) throws IOException {
        Collection<File> jars = FileUtils.listFiles(dir, new SuffixFileFilter(".jar"), null);
        URL[] urls = FileUtils.toURLs(jars.toArray(new File[jars.size()]));
        return Lists.newArrayList(urls);
    }
}
