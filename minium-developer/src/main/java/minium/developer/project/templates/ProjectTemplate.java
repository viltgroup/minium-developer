package minium.developer.project.templates;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;

import minium.developer.web.rest.dto.ProjectDTO;

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
