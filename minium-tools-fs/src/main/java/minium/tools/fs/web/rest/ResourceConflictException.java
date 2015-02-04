package minium.tools.fs.web.rest;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(value = HttpStatus.CONFLICT)
public class ResourceConflictException extends RuntimeException {

    private static final long serialVersionUID = -266785960375406620L;

    public ResourceConflictException() {
        super();
    }

    public ResourceConflictException(String message, Throwable cause) {
        super(message, cause);
    }

    public ResourceConflictException(String message) {
        super(message);
    }

    public ResourceConflictException(Throwable cause) {
        super(cause);
    }
}
