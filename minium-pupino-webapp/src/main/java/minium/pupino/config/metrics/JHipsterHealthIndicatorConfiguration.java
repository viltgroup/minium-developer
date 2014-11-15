package minium.pupino.config.metrics;

import javax.inject.Inject;
import javax.sql.DataSource;

import org.springframework.boot.actuate.health.HealthIndicator;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.mail.javamail.JavaMailSender;

@Configuration
public class JHipsterHealthIndicatorConfiguration {

    @Inject
    private JavaMailSender javaMailSender;

    @Inject
    private DataSource dataSource;

    @Bean
    public HealthIndicator dbHealthIndicator() {
        return new DatabaseHealthIndicator(dataSource);
    }

    @Bean
    public HealthIndicator mailHealthIndicator() {
        return new JavaMailHealthIndicator(javaMailSender);
    }
}
