package minium.developer.service;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.io.PrintStream;

import javax.annotation.PostConstruct;
import javax.annotation.PreDestroy;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.core.MessageSendingOperations;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import com.google.common.base.Throwables;

@Service
public class LogService {

    @Component
    public static class LogThread extends Thread {

        private File miniumDeveloperFile;

        @Autowired
        private MessageSendingOperations<String> messagingTemplate;


        public LogThread() throws IOException {
            this.miniumDeveloperFile = File.createTempFile("minium-developer", ".log");
            this.setDaemon(true);
        }

        @Override
        public void run() {

            try {
                System.setOut(new PrintStream(miniumDeveloperFile));

                FileReader fr = new FileReader(miniumDeveloperFile);
                try (BufferedReader br = new BufferedReader(fr)) {
                    while (true) {
                        String line = br.readLine();
                        if (line == null) {
                            Thread.sleep(1 * 1000);
                        } else {
                            messagingTemplate.convertAndSend("/log", line);
                        }
                    }
                }
            } catch (IOException e) {
                throw Throwables.propagate(e);
            } catch (InterruptedException e) {
                // just quit
            }
        }

        @Override
        @PreDestroy
        public void destroy() {
            this.interrupt();
        }
    }

    private final LogThread logThread;

    @Autowired
    public LogService(LogThread logThread) {
        this.logThread = logThread;
    }

    @PostConstruct
    public void start() throws IOException {
        logThread.setDaemon(true);
        logThread.start();
    }
}
