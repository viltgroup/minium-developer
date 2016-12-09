package minium.developer.fs.web.method.support;

import static java.lang.String.format;

import java.net.MalformedURLException;
import java.net.URI;
import java.net.URISyntaxException;
import java.net.URL;

import javax.servlet.http.HttpServletRequest;

import org.springframework.core.MethodParameter;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.support.WebDataBinderFactory;
import org.springframework.web.context.request.NativeWebRequest;
import org.springframework.web.context.request.ServletWebRequest;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.method.support.ModelAndViewContainer;

import com.google.common.base.Throwables;

@Component
public class BaseURLHandlerMethodArgumentResolver implements HandlerMethodArgumentResolver {

    @Override
    public Object resolveArgument(MethodParameter methodParameter, ModelAndViewContainer mavContainer, NativeWebRequest webRequest, WebDataBinderFactory binderFactory) {
        try {
            // http://stackoverflow.com/questions/3686808/spring-3-requestmapping-get-path-value
            HttpServletRequest request = ((ServletWebRequest) webRequest).getRequest();
            String url = buildFullRequestUrl(request.getScheme(), request.getServerName(), request.getServerPort(), request.getContextPath(), null);

            if (methodParameter.getParameterType() == String.class) return url;
            if (methodParameter.getParameterType() == URL.class) return new URL(url);
            if (methodParameter.getParameterType() == URI.class) return new URI(url);

            throw new IllegalArgumentException(format("Class %s is not supported", methodParameter.getParameterType()));
        } catch (MalformedURLException e) {
            throw Throwables.propagate(e);
        } catch (URISyntaxException e) {
            throw Throwables.propagate(e);
        }
    }

    @Override
    public boolean supportsParameter(MethodParameter methodParameter) {
        BaseURL baseURL = methodParameter.getParameterAnnotation(BaseURL.class);
        return baseURL != null;
    }

    // from org.springframework.security.web.util.UrlUtils#buildFullRequestUrl(String, String, int, String, String)
    /**
     * Obtains the full URL the client used to make the request.
     * <p>
     * Note that the server port will not be shown if it is the default server port for HTTP or HTTPS
     * (80 and 443 respectively).
     *
     * @return the full URL, suitable for redirects (not decoded).
     */
    protected static String buildFullRequestUrl(String scheme, String serverName, int serverPort, String requestURI, String queryString) {
        scheme = scheme.toLowerCase();

        StringBuilder url = new StringBuilder();
        url.append(scheme).append("://").append(serverName);

        // Only add port if not default
        if ("http".equals(scheme)) {
            if (serverPort != 80) {
                url.append(":").append(serverPort);
            }
        } else if ("https".equals(scheme)) {
            if (serverPort != 443) {
                url.append(":").append(serverPort);
            }
        }

        // Use the requestURI as it is encoded (RFC 3986) and hence suitable for redirects.
        url.append(requestURI);

        if (queryString != null) {
            url.append("?").append(queryString);
        }

        return url.toString();
    }
}
