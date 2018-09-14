package minium.developer.project;

import static org.junit.Assert.assertEquals;

import java.io.File;
import java.io.IOException;
import java.net.URL;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.apache.commons.io.FileUtils;
import org.apache.commons.io.FilenameUtils;
import org.junit.Before;
import org.junit.Test;

import com.google.common.collect.Lists;
import com.google.common.io.Files;

import minium.developer.project.MavenDependencyProvider.MavenException;
import minium.web.WebElements;

public class MavenDependencyProviderTest {

    private static class MavenDependency {
        String groupId;
        String artifactId;
        String version;

        MavenDependency(String groupId, String artifactId, String version) {
            this.groupId = groupId;
            this.artifactId = artifactId;
            this.version = version;
        }
    }

    private MavenDependencyProvider mavenDependencyProvider;

    @Before
    public void init() {
        mavenDependencyProvider = new MavenDependencyProvider();
    }

    @Test
    public void testGetDependencies() throws IOException, MavenException {
        List<MavenDependency> dependencies = Lists.newArrayList(
                new MavenDependency("org.apache.maven.wagon", "wagon-http-lightweight", "3.2.0"),
                new MavenDependency("org.eclipse.aether", "aether-transport-wagon", "1.1.0"));
        File projectDir = createMavenProject(dependencies);
        Set<String> dependencyFileNames = mavenDependencyProvider.getDependencies(projectDir).stream()
                .map(URL::getPath)
                .map(FilenameUtils::getName)
                .collect(Collectors.toSet());
        Set<String> expectedDepedencyFileNames = dependencies.stream()
                .map(dependency -> dependency.artifactId + "-" + dependency.version + ".jar")
                .collect(Collectors.toSet());
        assertEquals(dependencyFileNames, expectedDepedencyFileNames);
    }

    private File createMavenProject(List<MavenDependency> dependencies) throws IOException {
        File projectDir = Files.createTempDir();
        File pom = new File(projectDir, "pom.xml");
        FileUtils.writeStringToFile(pom, buildPom(dependencies));
        return projectDir;
    }

    private String buildPom(List<MavenDependency> dependencies) {
        String miniumCoreVersion = WebElements.class.getPackage().getImplementationVersion();
        if (miniumCoreVersion == null) miniumCoreVersion = "1.9.0";
        return "<project>" +
              "  <modelVersion>4.0.0</modelVersion>" +
              "  <parent>" +
              "    <groupId>io.vilt.minium</groupId>" +
              "    <artifactId>minium-cucumber-parent</artifactId>" +
              "    <version>" + miniumCoreVersion + "</version>" +
              "    <relativePath/>" +
              "  </parent>" +
              "  <groupId>minium</groupId>" +
              "  <artifactId>e2e-tests</artifactId>" +
              "  <version>1.0</version>" +
              "  <dependencies>" +
              dependencies.stream().map(dependency ->
                  "<dependency>" +
                  "  <groupId>" + dependency.groupId + "</groupId>" +
                  "  <artifactId>" + dependency.artifactId + "</artifactId>" +
                  "  <version>" + dependency.version + "</version>" +
                  "</dependency>"
              ).collect(Collectors.joining("")) +
              "  </dependencies>" +
              "</project>";
    }
}
