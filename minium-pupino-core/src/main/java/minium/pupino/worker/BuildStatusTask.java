package minium.pupino.worker;

import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ScheduledFuture;

import minium.pupino.jenkins.JenkinsClient;
import minium.pupino.service.BuildService;
import minium.pupino.web.rest.dto.BuildDTO;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.messaging.core.MessageSendingOperations;

import com.offbytwo.jenkins.model.Build;
import com.offbytwo.jenkins.model.BuildWithDetails;
import com.offbytwo.jenkins.model.JobWithDetails;

public class BuildStatusTask implements Runnable {
	private final Logger log = LoggerFactory.getLogger(JenkinsWorker.class);
	private ScheduledFuture<?> fut;

	private JenkinsClient jenkinsClient;

	private BuildService buildService;

	private minium.pupino.domain.Build build;

	private JobWithDetails job;

	private int buildNumber;

	private final MessageSendingOperations<String> messagingTemplate;

	private Map<Integer, ScheduledFuture> scheduledRunnable = new ConcurrentHashMap<Integer, ScheduledFuture>();

	private int index;
	
	private String sessionID;
	
	public BuildStatusTask(minium.pupino.domain.Build build, JobWithDetails job, int buildNumber, MessageSendingOperations<String> messagingTemplate,
			BuildService buildService, JenkinsClient jenkinsClient, int num, Map<Integer, ScheduledFuture> scheduledRunnable, String sessionID) {

		this.index = num;
		this.build = build;
		this.job = job;
		this.buildNumber = buildNumber;
		this.messagingTemplate = messagingTemplate;
		this.buildService = buildService;
		this.jenkinsClient = jenkinsClient;
		this.scheduledRunnable = scheduledRunnable;
		this.sessionID = sessionID;
	}

	public void run() {
		this.fut = scheduledRunnable.get(index);
		if (this.fut == null)
			return;

		log.debug("Check Build Started for build {} for index {}", buildNumber, index);
		try {

			Build jenkinsBuild = null;
			BuildWithDetails buildDetails = null;

			List<Build> buildsForJob = jenkinsClient.buildsForJob(job.getName());

			for (Build b : buildsForJob) {
				if (b.getNumber() == buildNumber) {
					jenkinsBuild = jenkinsClient.lastBuild(build.getProject().getName());
					buildDetails = jenkinsBuild.details();
					log.debug("Get Build {} Is Building {} Number {}", buildDetails, buildDetails.getResult(), buildDetails.getNumber());
					break;
				}
			}
			// if the build is finished
			if (buildDetails != null && buildDetails.isBuilding() == false) {
				// insert into database the method
				BuildDTO buildDTO = new BuildDTO(1, jenkinsBuild.getNumber(), jenkinsBuild.getUrl(), buildDetails.isBuilding(), buildDetails.getDescription(),
						buildDetails.getDuration(), buildDetails.getFullDisplayName(), buildDetails.getId(), buildDetails.getTimestamp(),
						jenkinsClient.getArtifactsBuild(buildDetails), null, null, "");

				buildService.update(build, buildDTO);

				fut.cancel(true);
				// remove from the object from the list
				scheduledRunnable.remove(index);
				log.debug("Build {} is Finished", buildDetails.getNumber());
			} else {
				if (buildDetails != null) {
					String msg = buildDetails.getEstimatedDuration() + "-" + buildDetails.getTimestamp();
					messagingTemplate.convertAndSend("/building/" + sessionID, msg);
					log.debug("Send message for /building {}", msg);
				}
			}

			log.debug("done");
			log.debug("isCancelled : " + fut.isCancelled());
			log.debug("isDone      : " + fut.isDone());

		} catch (Exception e) {
			log.debug("Error");
			e.printStackTrace();
		}

	}

	public Map<Integer, ScheduledFuture> getScheduledRunnable() {
		return scheduledRunnable;
	}

	public void setScheduledRunnable(Map<Integer, ScheduledFuture> scheduledRunnable) {
		this.scheduledRunnable = scheduledRunnable;
	}

}
