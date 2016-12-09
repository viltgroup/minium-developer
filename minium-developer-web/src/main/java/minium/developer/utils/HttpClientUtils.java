package minium.developer.utils;

import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.URI;
import java.net.URL;
import java.nio.charset.Charset;

public class HttpClientUtils {

    public static final String SPACE = "%20";

    public static URI encode(final String url) {
        return URI.create(url.replaceAll(" ", SPACE));
    }

    public String simpleRequest(final String target) throws IOException {
        return simpleRequest(encode(target));
    }

    public String simpleRequest(final URI uri) throws IOException {
        return simpleRequest(uri.toURL());
    }

    public String simpleRequest(final URL url) throws IOException {
        InputStream inputStream = url.openStream();
        StringBuilder stringBuilder = new StringBuilder();
        try (InputStreamReader in = new InputStreamReader(inputStream, Charset.forName("UTF-8"))) {
            final char[] buffer = new char[4096];
            int n;
            while (-1 != (n = in.read(buffer))) {
                stringBuilder.append(buffer, 0, n);
            }
        } finally {
            inputStream.close();
        }
        return stringBuilder.toString();
    }
}
