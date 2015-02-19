package minium.tools.fs.service;

import static java.lang.String.format;

import java.io.File;
import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.Date;
import java.util.List;
import java.util.Set;
import java.util.regex.Pattern;

import minium.tools.fs.domain.AutoFormatter;
import minium.tools.fs.domain.FileContent;
import minium.tools.fs.domain.FileProps;
import minium.tools.fs.web.rest.IllegalOperationException;
import minium.tools.fs.web.rest.ResourceConflictException;
import minium.tools.fs.web.rest.ResourceNotFoundException;

import org.apache.commons.io.FileUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.FileSystemResourceLoader;
import org.springframework.core.io.Resource;
import org.springframework.core.io.support.PathMatchingResourcePatternResolver;
import org.springframework.core.io.support.ResourcePatternResolver;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.util.UriComponentsBuilder;

import com.google.common.base.Charsets;
import com.google.common.collect.Lists;
import com.google.common.collect.Sets;

public class FileSystemService {

	private static final Logger LOGGER = LoggerFactory.getLogger(FileSystemService.class);

	@Autowired(required = false)
	private List<AutoFormatter> autoFormatters = Lists.newArrayList();

	private File baseDir = new File("src/test/resources");

	public FileSystemService() {
	}

	public FileSystemService(File baseDir) {
		this.baseDir = baseDir;
	}

	public FileProps getFileProps(String baseUrl, String path) throws IOException {
		File file = getFile(path);
		if (!file.exists())
			throw new ResourceNotFoundException();

		return extractFileProps(baseUrl, file);
	}

	public Set<FileProps> list(String baseUrl, String path) throws IOException {
		File file = getFile(path);
		if (!file.exists())
			throw new ResourceNotFoundException("File " + file.getAbsolutePath() + " not found");
		if (!file.isDirectory())
			new IllegalOperationException();

		File[] childFiles = file.listFiles();

		Set<FileProps> fileProps = Sets.newHashSet();

		if (childFiles != null) {
			for (File childFile : childFiles) {
				fileProps.add(extractFileProps(baseUrl, childFile));
			}
		}

		return fileProps;
	}

	public FileContent getFileContent(String baseUrl, String path) throws IOException, URISyntaxException {
		FileSystemResource resource = get(path);
		File file = resource.getFile();
		return extractFileContent(baseUrl, file);
	}

	public ResponseEntity<String> create(String baseUrl, @RequestBody String path) throws IOException, URISyntaxException {
		File file = getFile(path);
		if (file.exists()) {
			return new ResponseEntity<String>("Not Created", HttpStatus.PRECONDITION_FAILED);
		} else {
			file.createNewFile();
			LOGGER.info("Created new file {}", path);
			return new ResponseEntity<String>("Created", HttpStatus.OK);
		}
	}

	public void delete(String path) throws IOException {
		File file = getFile(path);
		if (!file.exists())
			throw new ResourceNotFoundException();
		if (!file.delete())
			new IllegalOperationException();
	}

	public FileContent save(String baseUrl, @RequestBody FileContent fileContent) throws IOException {
		FileProps fileProps = fileContent.getFileProps();
		File file = getFile(fileProps.getRelativeUri().getPath());
		if (!file.exists())
			throw new ResourceNotFoundException();

		if (file.lastModified() != fileProps.getLastModified().getTime())
			throw new ResourceConflictException();

		maybeAutoFormat(fileContent);

		FileUtils.write(file, fileContent.getContent(), Charsets.UTF_8);

		return extractFileContent(baseUrl, file);
	}

	public Set<FileProps> search(String baseUrl, String path, @RequestParam("q") String query) throws IOException {
		File file = getFile(path.endsWith("/") ? path.substring(0, path.length() - 1) : path);
		String antQuery = format("file://%s/**/*", file.getAbsolutePath());
		ResourcePatternResolver resolver = new PathMatchingResourcePatternResolver(new FileSystemResourceLoader());
		Resource[] allResources = resolver.getResources(antQuery);
		String charWildcards = query.replaceAll("\\W", "").replaceAll("(\\w)(?=\\w)", "$1.*");
		Pattern pattern = Pattern.compile(format(".*%s.*", charWildcards), Pattern.CASE_INSENSITIVE);
		Set<FileProps> fileProps = Sets.newHashSet();
		for (Resource resource : allResources) {
			File matchedFile = resource.getFile();
			if (matchedFile.isFile()) {
				FileProps fileProp = extractFileProps(baseUrl, resource.getFile());
				if (pattern.matcher(fileProp.getRelativeUri().toString()).matches())
					fileProps.add(fileProp);
			}
		}

		return fileProps;
	}

	protected void maybeAutoFormat(FileContent fileContent) {
		for (AutoFormatter autoFormatter : autoFormatters) {
			if (autoFormatter.handles(fileContent)) {
				autoFormatter.format(fileContent);
			}
		}
	}

	protected FileSystemResource get(String path) throws IOException, URISyntaxException {
		File file = getFile(path);
		if (!file.exists())
			throw new ResourceNotFoundException("File " + file.getAbsolutePath() + " not found");
		if (file.isDirectory())
			return null;
		return new FileSystemResource(file);
	}

	protected FileContent extractFileContent(String baseUrl, File file) throws IOException {
		FileProps props = extractFileProps(baseUrl, file);
		String content = FileUtils.readFileToString(file, Charsets.UTF_8);
		return new FileContent(props, content);
	}

	protected File getFile(String path) throws IOException {
		return new File(baseDir, path);
	}

	protected FileProps extractFileProps(String baseUrl, File file) throws IOException {
		URI relativeUri = baseDir.toURI().relativize(file.toURI());
		String path = relativeUri.getPath();
		FileProps fileProps = new FileProps();
		fileProps.setName(file.getName());
		URI uri = UriComponentsBuilder.fromHttpUrl(baseUrl).path("fs/").path(path.toString()).build().toUri();

		fileProps.setUri(uri);
		fileProps.setRelativeUri(relativeUri);
		fileProps.setSize(FileUtils.sizeOf(file));
		fileProps.setType(file.isFile() ? FileProps.Type.FILE : FileProps.Type.DIR);
		fileProps.setLastModified(new Date(file.lastModified()));
		return fileProps;
	}
}
