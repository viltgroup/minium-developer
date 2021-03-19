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

import minium.project.generator.web.rest.dto.ProjectDTO;
import org.apache.commons.io.FileUtils;

import java.io.File;
import java.io.IOException;

public class AutomatorProject extends ProjectTemplate {

    public AutomatorProject(ProjectDTO project) {
        super(project);
    }

    @Override
    public void buildStructure() throws IOException {
        // create the parent folder
        createParentDir(path);
        // create the structure of project into new project destination
        createStructure(path);
    }

    @Override
    public void buildFiles() {
        // Do nothing
    }

    private void createStructure(String destPath) throws IOException {
        // create folder modules file in root
        File file = new File(destPath, "modules");
        FileUtils.forceMkdir(file);
        // create a file a main.js in root
        File fileModules = new File(destPath);
        copyResource("/automator-project/main.js", fileModules, "main.js");
    }
}