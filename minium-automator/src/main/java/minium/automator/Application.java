package minium.automator;

import minium.automator.config.AutomatorConfiguration;
import minium.automator.config.AutomatorProperties;

import org.springframework.boot.ExitCodeGenerator;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.Banner.Mode;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;

@Configuration
@Import(AutomatorConfiguration.class)
public class Application {

    private static final class SimpleExitCodeGenerator implements ExitCodeGenerator {

        private final int exitCode;

        public SimpleExitCodeGenerator(int exitCode) {
            this.exitCode = exitCode;
        }

        @Override
        public int getExitCode() {
            return exitCode;
        }
    }

    public static void main(String[] args) {
        AutomatorProperties automatorProperties = AutomatorConfiguration.readAutomationProperties(args);
        if (automatorProperties == null) {
            return;
        }

        int exitCode = 0;
        ConfigurableApplicationContext context = null;
        try {
            context = new SpringApplicationBuilder(Application.class)
                .bannerMode(Mode.CONSOLE)
                .web(false)
                .build()
                .run(args);
        } catch (Exception e) {
            e.printStackTrace();
            exitCode = 1;
        }

        if (context != null) {
            SpringApplication.exit(context, new SimpleExitCodeGenerator(exitCode));
        }
    }

}
