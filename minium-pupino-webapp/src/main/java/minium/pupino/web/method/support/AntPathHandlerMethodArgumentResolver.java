package minium.pupino.web.method.support;

import javax.servlet.http.HttpServletRequest;

import org.springframework.core.MethodParameter;
import org.springframework.stereotype.Component;
import org.springframework.util.AntPathMatcher;
import org.springframework.web.bind.support.WebDataBinderFactory;
import org.springframework.web.context.request.NativeWebRequest;
import org.springframework.web.context.request.ServletWebRequest;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.method.support.ModelAndViewContainer;
import org.springframework.web.servlet.HandlerMapping;

@Component
public class AntPathHandlerMethodArgumentResolver implements HandlerMethodArgumentResolver {

    @Override
    public Object resolveArgument(MethodParameter methodParameter, ModelAndViewContainer mavContainer, NativeWebRequest webRequest, WebDataBinderFactory binderFactory) {
        HttpServletRequest request = ((ServletWebRequest) webRequest).getRequest();

        AntPath antMatcherPath = methodParameter.getParameterAnnotation(AntPath.class);
        if (!antMatcherPath.value().isEmpty()) {
            // first, we try to get the path value from the corresponding parameter
            String param = antMatcherPath.value();
            String parameter = request.getParameter(param);
            if (parameter != null) return parameter;
        }

        // http://stackoverflow.com/questions/3686808/spring-3-requestmapping-get-path-value
        String pattern = (String) request.getAttribute(HandlerMapping.BEST_MATCHING_PATTERN_ATTRIBUTE);
        String path = (String) request.getAttribute(HandlerMapping.PATH_WITHIN_HANDLER_MAPPING_ATTRIBUTE);

        return new AntPathMatcher().extractPathWithinPattern(pattern, path);
    }

    @Override
    public boolean supportsParameter(MethodParameter methodParameter) {
        AntPath antMatcherPath = methodParameter.getParameterAnnotation(AntPath.class);
        return antMatcherPath != null;
    }
}
