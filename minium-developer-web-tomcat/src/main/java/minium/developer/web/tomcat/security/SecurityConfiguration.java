package minium.developer.web.tomcat.security;

import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.web.authentication.preauth.RequestAttributeAuthenticationFilter;

@Configuration
@EnableWebSecurity
@EnableGlobalMethodSecurity(prePostEnabled = true)
public class SecurityConfiguration extends WebSecurityConfigurerAdapter {
    @Override
    public void configure(WebSecurity web) throws Exception {
        web.ignoring()
                .antMatchers("/")
                .antMatchers("/index.html")
                .antMatchers("/robots.txt")
                .antMatchers("/assets/**")
                .antMatchers("/bower_components/**")
                .antMatchers("/dist/**")
                .antMatchers("/i18n/**")
                .antMatchers("/minium.developer/**")
                .antMatchers("/scripts/**");
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http
            .csrf().disable()
            .sessionManagement()
            .sessionFixation().none()
        .and()
            .addFilterAfter(new CrossContextAuthFilter(), RequestAttributeAuthenticationFilter.class)
            .authorizeRequests()
            .antMatchers("/app/**").authenticated()
            .antMatchers("/api/**").authenticated();
    }
}
