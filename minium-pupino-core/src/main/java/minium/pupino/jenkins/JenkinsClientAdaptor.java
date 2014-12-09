package minium.pupino.jenkins;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

import javax.xml.bind.JAXBException;

import minium.pupino.utils.UrlUtils;
import minium.pupino.web.rest.dto.BuildDTO;
import minium.pupino.web.rest.dto.SummaryDTO;
import net.masterthought.cucumber.json.Feature;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Component;

import com.google.common.collect.Lists;
import com.google.gson.JsonIOException;
import com.google.gson.JsonSyntaxException;
import com.offbytwo.jenkins.JenkinsServer;
import com.offbytwo.jenkins.model.Artifact;
import com.offbytwo.jenkins.model.Build;
import com.offbytwo.jenkins.model.BuildWithDetails;
import com.offbytwo.jenkins.model.JobWithDetails;

@Component
@Qualifier("jenkinsOAkClient")
public class JenkinsClientAdaptor implements JenkinsClient {

	private JenkinsServer jenkins;
	
	private JenkinsJobConfigurator jobConfigurator;
	
	private ReporterParser reporter = new ReporterParser();

	private static URI uri;

	public JenkinsClientAdaptor() throws URISyntaxException {
		uri = new URI("http://lw255:8080/jenkins/");
		jobConfigurator = new JenkinsJobConfigurator();
	}

	@Override
	public JobWithDetails uri(String jobName) throws IOException, URISyntaxException {
		jenkins = new JenkinsServer(uri, "admin", "admin");
		JobWithDetails job = jenkins.getJob(jobName);
		return job;
	}

	/*
	 * JOBS
	 */
	@Override
	public void createJob(String jobName,String scmType,String repository) throws IOException, JAXBException {
		try {
			jenkins = new JenkinsServer(uri, "admin", "admin");
			String sourceXml = jobConfigurator.getXMLSource(scmType, repository);
			jenkins.createJob(jobName, sourceXml);
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}

	/*
	 * BUILDS
	 */
	@Override
	public List<Build> buildsForJob(String jobName) throws IOException, URISyntaxException {
		jenkins = new JenkinsServer(uri, "admin", "admin");
		return jenkins.getJob(jobName).getBuilds();
	}

	@Override
	public Build lastBuild(String jobName) throws IOException {
		jenkins = new JenkinsServer(uri, "admin", "admin");
		return jenkins.getJob(jobName).getLastCompletedBuild();
	}

	@Override
	public void createBuild(String jobName) throws IOException, URISyntaxException {
		jenkins = new JenkinsServer(uri, "admin", "admin");
		JobWithDetails job = jenkins.getJob(jobName);
		job.build();
	}

	@Override
	public List<BuildDTO> getBuilds(String jobName) throws IOException, URISyntaxException {
		List<Build> builds = buildsForJob(jobName);
		List<BuildDTO> buildsDTO = Lists.newArrayList();
		BuildDTO buildDTO;
		BuildWithDetails bd;
		boolean lastBuild = true;
		SummaryDTO summary = null;
		String artifact = "";
		for (Build b : builds) {
			bd = b.details();
			String result = getStatusForBuild(bd);
			// only want the report of the lastBuild finished
			if (lastBuild && !bd.isBuilding()) {
				// get the artifact of the build and return the string
				artifact = getArtifactsBuild(bd);
				lastBuild = false;
				List<Feature> features = reporter.parseJsonResult(artifact);
				summary = reporter.getSummaryFromFeatures(features);
				buildDTO = new BuildDTO(b.getNumber(), b.getUrl(), bd.getActions(), bd.isBuilding(), bd.getDescription(), bd.getDuration(),
						bd.getFullDisplayName(), bd.getId(), bd.getTimestamp(), result, artifact, features, summary);
			} else {
				summary = null;
				buildDTO = new BuildDTO(b.getNumber(), b.getUrl(), bd.getActions(), bd.isBuilding(), bd.getDescription(), bd.getDuration(),
						bd.getFullDisplayName(), bd.getId(), bd.getTimestamp(), result, summary);
			}
			buildsDTO.add(buildDTO);
		}
		return buildsDTO;
	}

	@Override
	public BuildDTO getBuildById(String jobName, String buildId) throws JsonSyntaxException, JsonIOException, IOException, URISyntaxException {
		List<Build> builds = buildsForJob(jobName);
		BuildDTO buildDTO = null;
		BuildWithDetails bd;
		boolean lastBuild = true;
		String artifact = "";
		for (Build b : builds) {
			bd = b.details();
			String result = getStatusForBuild(bd);
			// only want the report of the lastBuild finished
			if (lastBuild && !bd.isBuilding()) {
				// get the artifact of the build and return the string
				artifact = getArtifactsBuild(bd);
				lastBuild = false;
				List<Feature> features = reporter.parseJsonResult(artifact);
				for (Feature f : features) {
					f.processSteps();
				}
				buildDTO = new BuildDTO(b.getNumber(), b.getUrl(), bd.getActions(), bd.isBuilding(), bd.getDescription(), bd.getDuration(),
						bd.getFullDisplayName(), bd.getId(), bd.getTimestamp(), result, artifact, features, null);
			}

		}
		return buildDTO;
	}

	/**
	 * Get a specific build
	 *
	 * @param jobName
	 * @param buildId
	 * @return
	 * @throws IOException
	 * @throws URISyntaxException
	 */
	@Override
	public BuildDTO getBuildAndFeature(String jobName, String buildId, String featureURI) throws IOException, URISyntaxException {
		List<Build> builds = buildsForJob(jobName);
		BuildDTO buildDTO = null;
		BuildWithDetails bd;
		boolean lastBuild = true;
		for (Build b : builds) {
			String artifact = "";
			bd = b.details();
			if (bd.getId().equals(buildId)) {
				String result = getStatusForBuild(bd);
				// only want the report of the lastBuild finished
				if (lastBuild && !bd.isBuilding()) {
					// get the artifact of the build and return the string
					artifact = getArtifactsBuild(bd);
					lastBuild = false;
					Map<String, Feature> features = reporter.parseJsonResultSet(artifact);
					Feature f = features.get(featureURI);
					f.processSteps();
					buildDTO = new BuildDTO(b.getNumber(), b.getUrl(), bd.getActions(), bd.isBuilding(), bd.getDescription(), bd.getDuration(),
							bd.getFullDisplayName(), bd.getId(), bd.getTimestamp(), result, artifact, Arrays.asList(f), null);
				}
			}
		}
		return buildDTO;
	}

	/*
	 * ARTIFACTS
	 */
	@Override
	public String getArtifactsBuild(BuildWithDetails buildDetails) {
		String artifactContent = "";
		if (!buildDetails.getArtifacts().isEmpty()) {
		Artifact artifact = buildDetails.getArtifacts().get(0);
			// function from the jenkins client was not working properly use this temporary solution
			if (artifact.getDisplayPath().equals("result.json")) {
				artifactContent = UrlUtils.extractContentAsString(buildDetails.getUrl() + "artifact/result.json", buildDetails.getId());
			}else{
				artifactContent = artifactFromFile("mocks/mock-cgd-store.json");
			}
		}
		return artifactContent;
	}

	private String getStatusForBuild(BuildWithDetails bd) {
		return (bd.getResult() != null) ? bd.getResult().toString() : "BUILDING";
	}

	private String artifactFromFile(String file) {
		BufferedReader br = null;
		String artifactContent = null;
		try {
			File fileDir = new File(file);

			br = new BufferedReader(new InputStreamReader(new FileInputStream(fileDir), "UTF8"));
			StringBuilder sb = new StringBuilder();
			String line = br.readLine();

			while (line != null) {
				sb.append(line);
				sb.append(System.lineSeparator());
				line = br.readLine();
			}
			artifactContent = sb.toString();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} finally {
			try {
				br.close();
			} catch (IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}
		return artifactContent;
	}

}
