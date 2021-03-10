package minium.developer.fs.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@Profile("remote")
@Service("fileSystemPermissionService")
public class RemoteFileSystemPermissionService implements FileSystemPermissionService {

    private static final Logger LOGGER = LoggerFactory.getLogger(RemoteFileSystemPermissionService.class);

    @Override
    public boolean canWrite(String projectName) {
        return checkPermission(projectName, "WRITE");
    }

    @Override
    public boolean canRead(String projectName) {
        return checkPermission(projectName, "READ");
    }

    private boolean checkPermission(String projectName, String permission) {
        HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder.currentRequestAttributes()).getRequest();
        request.setAttribute("minium.manager.security.project", projectName);
        ServletContext root = request.getServletContext().getContext("/");

        HttpServletResponse response = ((ServletRequestAttributes) RequestContextHolder.currentRequestAttributes()).getResponse();
        try {
            root.getRequestDispatcher("/sso/auth").include(request, response);
            String acl = (String) request.getAttribute("minium.manager.security.project.acl");
            boolean result = acl.contains(permission);
            LOGGER.debug("The user {} '{}' permission for the project '{}'", (result ? "have" : "don't have"), permission, projectName);
            return result;
        } catch (Exception e) {
            LOGGER.error("Error Calculating the permission '{}' for the project '{}'!", permission, projectName, e);
            return false;
        }
    }
}
