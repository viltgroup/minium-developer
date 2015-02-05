package minium.tools.fs.config;

import java.util.List;

import minium.tools.fs.web.method.support.AntPathHandlerMethodArgumentResolver;
import minium.tools.fs.web.method.support.BaseURLHandlerMethodArgumentResolver;

import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;

@Configuration
@ComponentScan("minium.tools.fs")
public class FileSystemConfiguration extends WebMvcConfigurerAdapter {

    @Override
    public void addArgumentResolvers(List<HandlerMethodArgumentResolver> argumentResolvers) {
        argumentResolvers.add(new AntPathHandlerMethodArgumentResolver());
        argumentResolvers.add(new BaseURLHandlerMethodArgumentResolver());
    }
}
