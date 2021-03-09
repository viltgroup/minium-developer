package minium.developer.fs.service;

import org.springframework.context.annotation.Primary;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;

@Primary
@Profile("!remote")
@Service("fileSystemPermissionService")
public class LocalFileSystemPermissionService implements FileSystemPermissionService {

    @Override
    public boolean canWrite(String projectName) {
        return true;
    }

    @Override
    public boolean canRead(String projectName) {
        return true;
    }
}
