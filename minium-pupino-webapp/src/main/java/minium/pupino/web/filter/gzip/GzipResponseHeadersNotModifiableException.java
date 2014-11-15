package minium.pupino.web.filter.gzip;

import javax.servlet.ServletException;

public class GzipResponseHeadersNotModifiableException extends ServletException {

    private static final long serialVersionUID = -8495893129159913718L;

    public GzipResponseHeadersNotModifiableException(String message) {
        super(message);
    }
}
