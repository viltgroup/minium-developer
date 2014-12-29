package minium.pupino.worker;

import java.util.concurrent.ExecutionException;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.ScheduledFuture;
import java.util.concurrent.TimeUnit;

import minium.pupino.jenkins.JenkinsClient;
import minium.pupino.service.BuildService;
import minium.pupino.web.rest.dto.BuildDTO;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import com.offbytwo.jenkins.model.Build;
import com.offbytwo.jenkins.model.BuildWithDetails;

@Service
public class JenkinsWorker {
	private final Logger log = LoggerFactory.getLogger(JenkinsWorker.class);
	
	private ScheduledExecutorService exec = Executors.newSingleThreadScheduledExecutor();
	
	@Autowired
	private JenkinsClient jenkinsClient;
	
	@Autowired
	private BuildService buildService;
	
	private ScheduledFuture<?> fut;
	
	@Async
	public void checkBuildState(final minium.pupino.domain.Build build) throws InterruptedException, ExecutionException {
		Runnable fiveSecondTask = new Runnable() {
			@Override
			public void run() {
				log.debug("Check Build Started");
				try {
					Build jenkinsBuild = jenkinsClient.lastBuild("server");
					BuildWithDetails buildDetails = jenkinsBuild.details();
					log.debug("Get Build {} Is Building {} Number {}", buildDetails,buildDetails.getResult(),buildDetails.getNumber());
					
					if (buildDetails != null && buildDetails.isBuilding() == false) {
						//insert into database the method
						BuildDTO buildDTO = new BuildDTO(1,jenkinsBuild.getNumber(), jenkinsBuild.getUrl(), buildDetails.isBuilding(), buildDetails.getDescription(), buildDetails.getDuration(),
								buildDetails.getFullDisplayName(), buildDetails.getId(), buildDetails.getTimestamp(), jenkinsClient.getArtifactsBuild(buildDetails), null, null,"");
						
						minium.pupino.domain.Build build1 =  buildService.update(build,buildDTO);
						
						fut.cancel(true);
						log.debug("Build {} is Finished",buildDetails.getNumber());
					}
					
					log.debug("done");
					log.debug("isCancelled : " + fut.isCancelled());
					log.debug("isDone      : " + fut.isDone());
					
				} catch (Exception e) {
					log.debug("Error");
					e.printStackTrace();
				}

			}
		};
		
		//need another solution
		Thread.sleep(10000);
		
		fut = exec.scheduleAtFixedRate(fiveSecondTask, 0, 5, TimeUnit.SECONDS);

	}
	
	
}
