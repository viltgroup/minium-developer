package minium.developer.fs.web.rest;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(value = HttpStatus.BAD_REQUEST)
public class IllegalOperationException extends RuntimeException {

    private static final long serialVersionUID = 7471206337213364052L;

    public IllegalOperationException() {
        super();
    }

    public IllegalOperationException(String message, Throwable cause) {
        super(message, cause);
    }

    public IllegalOperationException(String message) {
        super(message);
    }

    public IllegalOperationException(Throwable cause) {
        super(cause);
    }
}
