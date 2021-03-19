/*
 * Copyright (C) 2015 The Minium Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package minium.project.generator.template;

import com.google.common.collect.Maps;
import freemarker.template.Configuration;
import freemarker.template.Template;
import minium.project.generator.utils.Utils;
import minium.project.generator.web.rest.dto.ProjectDTO;
import org.apache.commons.io.FileUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStreamWriter;
import java.io.Writer;
import java.util.Map;

public class MonitoringProject extends MavenProjectTemplate {

    private static final Logger LOGGER = LoggerFactory.getLogger(MonitoringProject.class);

    public MonitoringProject(ProjectDTO project, String miniumVersion, String springVersion) {
        super(project, MONITORING, miniumVersion, springVersion);
    }

    @Override
    public void buildFiles() throws IOException {
        // Create ExecutorTest
        createExecutorClass();
        // create AssemblyFile
        createAssemblyFile();

        super.buildFiles();
    }

    private void createExecutorClass() throws IOException {
        File f = new File(path + "/src/main/java");
        FileUtils.forceMkdir(f);

        File newFile = new File(f, "ExecutorTest.java");
        Configuration cfg = new Configuration(Configuration.DEFAULT_INCOMPATIBLE_IMPROVEMENTS);
        cfg.setClassForTemplateLoading(this.getClass(), "/");
        try {
            // Load the template
            Template template = cfg.getTemplate("monitoring-project/ExecutorTest.ftl");

            Map<String, Object> data = Maps.newHashMap();
            data.put("className", project.getGroupId() + "." + Utils.toClassName(project.getArtifactId()) + "IT");

            try (Writer out = new OutputStreamWriter(new FileOutputStream(newFile))) {
                template.process(data, out);
                out.flush();
            }
        } catch (Exception e) {
            LOGGER.debug("Error occurred when generating {}", newFile, e);
        }
    }

    private void createAssemblyFile() throws IOException {
        File f = new File(path + "/src/main/assembly");
        FileUtils.forceMkdir(f);
        copyResource("/monitoring-project/assembly.xml", f, "assembly.xml");
    }

    @Override
    protected void buildCucumberFiles() throws IOException {
        File f = new File(path + "/src/test/resources/steps");
        copyResource("/monitoring-project/after.js", f, "after.js");

        f = new File(path + "/src/test/resources/modules");
        copyResource("/monitoring-project/performance.js", f, "performance.js");
        super.buildCucumberFiles();
    }
}
