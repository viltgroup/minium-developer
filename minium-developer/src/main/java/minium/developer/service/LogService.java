package minium.developer.service;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.io.PrintStream;

import javax.annotation.PostConstruct;
import javax.annotation.PreDestroy;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.core.MessageSendingOperations;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import com.Ostermiller.util.CircularByteBuffer;
import com.google.common.base.Throwables;

@Service
public class LogService {

    @Component
    public static class LogThread extends Thread {

        private MessageSendingOperations<String> messagingTemplate;
        private CircularByteBuffer buffer;

        @Autowired
        private LogThread(MessageSendingOperations<String> messagingTemplate) {
            this.messagingTemplate = messagingTemplate;
            // 256KB
            this.buffer = new CircularByteBuffer(256 * 1024, true);
        }

        public LogThread() throws IOException {
            this.setDaemon(true);
        }

        @Override
        public void run() {
            PrintStream prevOut = System.out;
            try {
                InputStream in = buffer.getInputStream();
                OutputStream out = buffer.getOutputStream();

                System.setOut(new PrintStream(out));
                try (BufferedReader br = new BufferedReader(new InputStreamReader(in))) {
                    while (true) {
                        String line = br.readLine();
                        if (line == null) {
                            return;
                        } else {
                            messagingTemplate.convertAndSend("/log", line);
                        }
                    }
                }
            } catch (IOException e) {
                throw Throwables.propagate(e);
            } finally {
                System.setOut(prevOut);
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
