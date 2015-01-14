package minium.pupino.worker;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.ScheduledFuture;
import java.util.concurrent.TimeUnit;

import minium.pupino.jenkins.JenkinsClient;
import minium.pupino.service.BuildService;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.core.MessageSendingOperations;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import com.offbytwo.jenkins.model.JobWithDetails;

@Service
public class JenkinsWorker {
	private final Logger log = LoggerFactory.getLogger(JenkinsWorker.class);

	private ScheduledExecutorService exec;

	@Autowired
	private JenkinsClient jenkinsClient;

	@Autowired
	private BuildService buildService;
	
	private Map<Integer, ScheduledFuture> scheduledRunnable = new ConcurrentHashMap<Integer, ScheduledFuture>();
	
	private int num= 0;
	
	private final MessageSendingOperations<String> messagingTemplate;

	@Autowired
	public JenkinsWorker(final MessageSendingOperations<String> messagingTemplate) {
		this.messagingTemplate = messagingTemplate;
		exec = Executors.newSingleThreadScheduledExecutor();
	}

	@Async
	public void checkBuildState(final minium.pupino.domain.Build build, final JobWithDetails job,final int buildNumber, String sessionID) throws InterruptedException, ExecutionException {
		ScheduledFuture<?> scheduleFuture;
		
		scheduleFuture = exec.scheduleAtFixedRate(new BuildStatusTask(build,job,buildNumber,messagingTemplate, buildService, jenkinsClient,num,scheduledRunnable,sessionID), 0, 2, TimeUnit.SECONDS);
		log.debug("Executing ...");
		scheduledRunnable.put(num++, scheduleFuture);

	}

}
