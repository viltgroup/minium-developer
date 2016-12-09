package minium.developer.fs.config;

import java.util.List;

import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;

import minium.developer.fs.web.method.support.AntPathHandlerMethodArgumentResolver;
import minium.developer.fs.web.method.support.BaseURLHandlerMethodArgumentResolver;

@Configuration
@ComponentScan("minium.developer.fs")
public class FileSystemConfiguration extends WebMvcConfigurerAdapter {

    @Override
    public void addArgumentResolvers(List<HandlerMethodArgumentResolver> argumentResolvers) {
        argumentResolvers.add(new AntPathHandlerMethodArgumentResolver());
        argumentResolvers.add(new BaseURLHandlerMethodArgumentResolver());
    }
}
