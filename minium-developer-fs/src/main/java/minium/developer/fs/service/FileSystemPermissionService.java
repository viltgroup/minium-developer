package minium.developer.fs.service;

public interface FileSystemPermissionService {
    boolean canWrite(String projectName);
    boolean canRead(String projectName);
}
