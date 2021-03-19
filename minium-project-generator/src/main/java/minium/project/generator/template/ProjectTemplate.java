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

import java.io.File;
import java.io.IOException;
import java.io.InputStream;

import minium.project.generator.web.rest.dto.ProjectDTO;
import org.apache.commons.io.FileUtils;

public abstract class ProjectTemplate {

    protected ProjectDTO project;
    protected String path;

    public ProjectTemplate(ProjectDTO project) {
        this.project = project;
        this.path = getBasePathName();
    }

    // template method, final so subclasses can't override
    public final void buildProject() throws IOException {
        buildStructure();
        buildFiles();
    }

    // methods to be implemented by subclasses
    public abstract void buildStructure() throws IOException;

    public abstract void buildFiles() throws IOException;

    protected String createParentDir(String path) throws IOException {
        File f = new File(path);
        FileUtils.forceMkdir(f);
        return f.getPath();
    }

    protected void copyStructure(String destPath, final String template) throws IOException {
        File templateDir = new File(template);
        File destDir = new File(destPath);
        FileUtils.copyDirectory(templateDir, destDir);
    }

    protected String getBasePathName() {
        File f = new File(project.getDirectory(), project.getName());
        return f.getPath();
    }

    protected void copyResource(String resourcePath, File destPath, String fileName) throws IOException {
        try (InputStream myResource = getClass().getResourceAsStream(resourcePath)) {
            File myResourceAsFile = new File(destPath, fileName);
            FileUtils.copyInputStreamToFile(myResource, myResourceAsFile);
        }
    }
}
