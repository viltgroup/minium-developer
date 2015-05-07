package minium.developer.service;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.io.PrintStream;

import javax.annotation.PostConstruct;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.core.MessageSendingOperations;
import org.springframework.stereotype.Service;

import com.google.common.base.Throwables;

@Service
public class LogService {

    private final MessageSendingOperations<String> messagingTemplate;

    @Autowired
    public LogService(final MessageSendingOperations<String> messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    @PostConstruct
    public void sendLog() throws FileNotFoundException  {
        System.setOut(new PrintStream(new File("/tmp/output-file.txt")));

        Thread logReader = new Thread() {
            @Override
            public void run() {
                try {
                    FileReader fr = new FileReader("/tmp/output-file.txt");
                    BufferedReader br = new BufferedReader(fr);

                    while (true) {
                        String line = br.readLine();
                        if (line == null) {
                            Thread.sleep(1 * 1000);
                        } else {
                            messagingTemplate.convertAndSend("/log", line);
                        }
                    }
                } catch (InterruptedException | IOException e) {
                    throw Throwables.propagate(e);
                }

            }

        };
        logReader.setDaemon(true);
        logReader.start();
    }
}
