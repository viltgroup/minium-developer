package minium.pupino.config;

import minium.pupino.browser.BrowserLauncher;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

@Profile("local")
@Configuration
public class LocalProfileConfiguration {

    @Bean
    public BrowserLauncher browserLauncher() {
        return new BrowserLauncher();
    }
}
