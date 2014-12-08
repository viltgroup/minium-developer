package minium.pupino.web.method.support;

import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.util.Arrays;

import javax.servlet.http.HttpServletRequest;

import org.apache.commons.lang3.StringUtils;
import org.springframework.core.MethodParameter;
import org.springframework.stereotype.Component;
import org.springframework.util.AntPathMatcher;
import org.springframework.web.bind.support.WebDataBinderFactory;
import org.springframework.web.context.request.NativeWebRequest;
import org.springframework.web.context.request.ServletWebRequest;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.method.support.ModelAndViewContainer;
import org.springframework.web.servlet.HandlerMapping;

import com.google.common.base.Charsets;
import com.google.common.base.Function;
import com.google.common.collect.Collections2;


@Component
public class AntPathHandlerMethodArgumentResolver implements HandlerMethodArgumentResolver {
	
	private static final String URL_PATH_SEPARATOR = "/";

	@Override
	public Object resolveArgument(MethodParameter methodParameter, ModelAndViewContainer mavContainer, NativeWebRequest webRequest,
			WebDataBinderFactory binderFactory) {
		HttpServletRequest request = ((ServletWebRequest) webRequest).getRequest();

		AntPath antMatcherPath = methodParameter.getParameterAnnotation(AntPath.class);
		if (!antMatcherPath.value().isEmpty()) {
			// first, we try to get the path value from the corresponding
			// parameter
			String param = antMatcherPath.value();
			String parameter = request.getParameter(param);
			if (parameter != null) {
				return parameter;
			}
		}

		// http://stackoverflow.com/questions/3686808/spring-3-requestmapping-get-path-value
		String pattern = (String) request.getAttribute(HandlerMapping.BEST_MATCHING_PATTERN_ATTRIBUTE);
		String path = (String) request.getAttribute(HandlerMapping.PATH_WITHIN_HANDLER_MAPPING_ATTRIBUTE);

		String extractedPaths = new AntPathMatcher().extractPathWithinPattern(pattern, path);
		return decode(extractedPaths);
	}

	private String decode(String extractedPaths) {
		return StringUtils.join(Collections2.transform(Arrays.asList(extractedPaths.split(URL_PATH_SEPARATOR)), new Function<String, String>() {
			@Override
			public String apply(String input) {
				try {
					return URLDecoder.decode(input, Charsets.UTF_8.name());
				} catch (UnsupportedEncodingException e) {
					return input;
				}
			}
		}), URL_PATH_SEPARATOR);
	}

	@Override
	public boolean supportsParameter(MethodParameter methodParameter) {
		AntPath antMatcherPath = methodParameter.getParameterAnnotation(AntPath.class);
		return antMatcherPath != null;
	}
}
