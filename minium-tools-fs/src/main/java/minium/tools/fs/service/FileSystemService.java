package minium.tools.fs.service;

import static java.lang.String.format;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.Date;
import java.util.List;
import java.util.Set;
import java.util.regex.Pattern;

import minium.tools.fs.domain.AutoFormatter;
import minium.tools.fs.domain.FileContent;
import minium.tools.fs.domain.FileDTO;
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
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.util.UriComponentsBuilder;

import com.google.common.base.Charsets;
import com.google.common.base.Throwables;
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

    public Set<FileProps> listAll(String baseUrl, String path) throws IOException {
        String property = System.getProperty("user.home");
        File file;
        file = new File(property, path);

        if (!file.exists())
            throw new ResourceNotFoundException("File " + file.getAbsolutePath() + " not found");
        if (!file.isDirectory())
            new IllegalOperationException();

        File[] childFiles = file.listFiles();

        Set<FileProps> fileProps = Sets.newHashSet();

        if (childFiles != null) {
            for (File childFile : childFiles) {
                if (childFile.isDirectory() && childFile.exists() && !childFile.isHidden()) {
                    fileProps.add(extractFileProps2(baseUrl, childFile));
                }
            }
        }

        return fileProps;
    }

    public FileContent getFileContent(String baseUrl, String path) throws IOException, URISyntaxException {
        FileSystemResource resource = get(path);
        File file = resource.getFile();
        return extractFileContent(baseUrl, file);
    }

    public FileProps create(String baseUrl, @RequestBody String path) throws IOException, URISyntaxException {
        File file = getFile(path);
        if (file.exists()) {
            return null;
        } else {
            file.createNewFile();
            LOGGER.info("Created new file {}", path);
            return extractFileProps(baseUrl, file);
        }
    }

    public FileProps createFolder(String baseUrl, @RequestBody String path) throws IOException, URISyntaxException {
        File theDir = getFile(path);
        FileProps props = null;
        // if the directory does not exist, create it
        if (!theDir.exists()) {
            boolean result = false;

            try {
                theDir.mkdir();
                result = true;
            } catch (SecurityException se) {
                // handle it
            }
            if (result) {
                LOGGER.info("Created new fodler {}", path);
                props = extractFileProps(baseUrl, theDir);
            }
        }
        return props;
    }

    public void delete(String path) throws IOException {
        File file = getFile(path);
        if (!file.exists())
            throw new ResourceNotFoundException();
        if (!file.delete())
            new IllegalOperationException();
    }

    public void deleteDirectory(String path) throws IOException {
        File directory = getFile(path);

        if (!directory.exists())
            throw new ResourceNotFoundException();
        if (!directory.delete())
            new IllegalOperationException();

        try {
            recursiveDelete(directory);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public FileProps renameFile(String baseUrl, FileDTO fileDTO) throws IOException {
        File file = getFile(fileDTO.getOldName());
        File newFile = new File(baseDir, fileDTO.getNewName());
        FileProps props = null;
        if (!file.exists())
            throw new ResourceNotFoundException();

        boolean success = file.renameTo(newFile);

        if (success) {
            // File was successfully renamed
            props = extractFileProps(baseUrl, newFile);
        }
        return props;
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

    public boolean dirExists(String path) {
        boolean dirExists = false;
        File f = new File(path);
        if (f.exists() && f.isDirectory()) {
            dirExists = true;
        }
        return dirExists;
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

    protected FileProps extractFileProps2(String baseUrl, File file) throws IOException {
        File homeDir = new File(System.getProperty("user.home"));
        URI relativeUri = homeDir.toURI().relativize(file.toURI());
        String path = relativeUri.getPath();
        FileProps fileProps = new FileProps();
        fileProps.setName(file.getName());
        URI uri = UriComponentsBuilder.fromHttpUrl(baseUrl).path("fs/").path(path.toString()).build().toUri();
        fileProps.setAbsoluteUri(file.getAbsolutePath());
        fileProps.setUri(uri);
        fileProps.setRelativeUri(relativeUri);
        fileProps.setType(file.isFile() ? FileProps.Type.FILE : FileProps.Type.DIR);
        fileProps.setLastModified(new Date(file.lastModified()));
        return fileProps;
    }

    public void recursiveDelete(File file) throws IOException {
        if (file.isDirectory()) {
            // directory is empty, then delete it
            if (file.list().length == 0) {
                file.delete();
                LOGGER.info("Directory is deleted : " + file.getAbsolutePath());
            } else {
                // list all the directory contents
                String files[] = file.list();
                for (String temp : files) {
                    // construct the file structure
                    File fileDelete = new File(file, temp);
                    // recursive delete
                    recursiveDelete(fileDelete);
                }
                // check the directory again, if empty then delete it
                if (file.list().length == 0) {
                    file.delete();
                    LOGGER.info("Directory is deleted : " + file.getAbsolutePath());
                }
            }
        } else {
            // if file, then delete it
            file.delete();
            LOGGER.info("File is deleted : " + file.getAbsolutePath());
        }
    }

    public Set<FileProps> searchContent(String baseUrl, String query) throws IOException {

        Set<FileProps> fileProps = Sets.newHashSet();

        if ("".equals(query) || query.length() <= 3) {
            return fileProps;
        }
        File file = getFile("steps");
        String antQuery = format("file://%s/**/*", file.getAbsolutePath());
        ResourcePatternResolver resolver = new PathMatchingResourcePatternResolver(new FileSystemResourceLoader());
        Resource[] allResources = resolver.getResources(antQuery);
        String charWildcards = query.replaceAll("\\W", "").replaceAll("(\\w)(?=\\w)", "$1.*");
        Pattern pattern = Pattern.compile(format(".*%s.*", charWildcards), Pattern.CASE_INSENSITIVE);

        for (Resource resource : allResources) {
            File matchedFile = resource.getFile();
            if (matchedFile.isFile()) {
                FileProps fileProp = extractFileProps(baseUrl, resource.getFile());
                try {
                    FileReader fileReader = new FileReader(matchedFile);
                    BufferedReader bufferedReader = new BufferedReader(fileReader);
                    String line;
                    int lineNo = 1;
                    while ((line = bufferedReader.readLine()) != null) {
                        if (pattern.matcher(line).matches()) {
                            fileProp.setLineNo(lineNo);
                            fileProps.add(fileProp);
                        }
                        lineNo++;
                    }
                    fileReader.close();
                } catch (IOException e) {
                    throw Throwables.propagate(e);
                }
            }
        }
        return fileProps;
    }
}
