package minium.pupino.service;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.net.URISyntaxException;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

import javax.inject.Inject;

import minium.pupino.domain.Build;
import minium.pupino.domain.Project;
import minium.pupino.jenkins.ReporterParser;
import minium.pupino.repository.BuildRepository;
import minium.pupino.web.rest.dto.BuildDTO;
import minium.pupino.web.rest.dto.SummaryDTO;
import net.masterthought.cucumber.json.Feature;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import com.google.common.collect.Lists;
import com.google.gson.JsonIOException;
import com.google.gson.JsonSyntaxException;

@Service
public class BuildService {

	@Inject
	private BuildRepository buildRepository;

	@Autowired
	private ReporterParser reporter;

	/**
	 * Create a Build for a project The initial state is BUILDING
	 * 
	 * @param p
	 * @return
	 */
	public Build create(Project p) {
		Build build = new Build();
		build.setProject(p);
		build.setState("BUILDING");
		return buildRepository.save(build);
	}

	/**
	 * Update a build state from a BuildDTO This method update the build and
	 * change the state of the build to Finished
	 * 
	 * @param build
	 * @param buildDTO
	 * @return
	 */
	public Build update(Build build, BuildDTO buildDTO) {
		build.setName(buildDTO.getFullDisplayName());
		build.setArtifact(buildDTO.getArtifact());
		build.setNumber(buildDTO.getNumber());
		build.setDuration(buildDTO.getDuration());
		build.setResult(buildDTO.getBuildResult());
		build.setTimestamp(buildDTO.getTimestamp());
		build.setKey(buildDTO.getKey());
		build.setState("FINISHED");
		return buildRepository.save(build);
	}

	public void save(List<BuildDTO> buildsDTO, Project p) {
		for (BuildDTO buildDTO : buildsDTO) {
			Build build = new Build();
			build.setName(buildDTO.getFullDisplayName());
			build.setArtifact(buildDTO.getArtifact());
			build.setNumber(buildDTO.getNumber());
			build.setDuration(buildDTO.getDuration());
			
			build.setTimestamp(buildDTO.getTimestamp());
			build.setKey(buildDTO.getKey());
			build.setProject(p);
			build.setState("FINISHED");
			buildRepository.save(build);
		}
	}

	/**
	 * Find all the builds in database
	 * 
	 * @return
	 * @throws IOException
	 * @throws URISyntaxException
	 */
	public List<BuildDTO> findAll() throws IOException, URISyntaxException {
		List<Build> builds = buildRepository.findAll();
		List<BuildDTO> buildsDTO = Lists.newArrayList();
		BuildDTO buildDTO;
		for (Build b : builds) {
			buildDTO = getBuildDTO(b);
			buildsDTO.add(buildDTO);
		}

		return buildsDTO;
	}

	/**
	 * Find the builds of a project
	 * 
	 * @param project
	 * @return
	 * @throws IOException
	 * @throws URISyntaxException
	 */
	public List<BuildDTO> findByProject(Project project) throws IOException, URISyntaxException {
		List<Build> builds = buildRepository.findByProjectOrderByNumberDesc(project);
		List<BuildDTO> buildsDTO = Lists.newArrayList();
		BuildDTO buildDTO;
		boolean lastBuild = true;
		List<Feature> features = null;
		SummaryDTO summary = null;
		for (Build b : builds) {
			// only want the report of the lastBuild finished
			if (lastBuild && b.getState().equals("FINISHED")) {
				// get the artifact of the build and return the string
				lastBuild = false;

				buildDTO = getBuildDTO(b);
			} else {
				if (b.getState().equals("FINISHED")) {
					features = reporter.parseJsonResult(b.getArtifact());
					summary = reporter.getSummaryFromFeatures(features);
				}
				buildDTO = new BuildDTO(b.getId(), Integer.valueOf(b.getNumber()), "", false, "", b.getDuration(), b.getName(), b.getKey(), b.getTimestamp(),
						"", null, summary, b.getState(),b.getResult());
			}
			buildsDTO.add(buildDTO);
		}

		return buildsDTO;
	}

	public BuildDTO findOne(Long id) throws JsonSyntaxException, JsonIOException, FileNotFoundException {
		Build b = buildRepository.findOne(id);
		return getBuildDTO(b);
	}

	public BuildDTO findByFeature(int id, String featureURI) throws JsonSyntaxException, JsonIOException, FileNotFoundException {
		Build b = buildRepository.findOne((long) id);
		Map<String, Feature> features = reporter.parseJsonResultSet(b.getArtifact());
		Feature f = features.get(featureURI);
		f.processSteps();

		BuildDTO buildDTO = new BuildDTO(b.getId(), Integer.valueOf(b.getNumber()), "", false, "", b.getDuration(), b.getName(), b.getKey(), b.getTimestamp(),
				b.getResult(), Arrays.asList(f), null, b.getState(),b.getResult());
		return buildDTO;
	}

	// REFACTOR THIS METHOD
	public BuildDTO findLastBuild(Project project) throws JsonSyntaxException, JsonIOException, FileNotFoundException {
		List<Build> builds = buildRepository.findLastBuild(project, new PageRequest(0, 1));
		BuildDTO buildDTO = null;
		if( !builds.isEmpty() ){
			buildDTO =  getBuildDTO(builds.get(0));
		}
		return buildDTO;
	}

	private BuildDTO getBuildDTO(Build b) throws JsonSyntaxException, JsonIOException, FileNotFoundException {
		List<Feature> features = null;
		SummaryDTO summary = null;
		//check if the build has artifact
		if ( b.getArtifact() != null && !b.getArtifact().equals("")) {
			features = reporter.parseJsonResult(b.getArtifact());
			summary = reporter.getSummaryFromFeatures(features);
		}
		BuildDTO buildDTO = new BuildDTO(b.getId(), Integer.valueOf(b.getNumber()), "", false, "", b.getDuration(), b.getName(), b.getKey(), b.getTimestamp(),
				b.getResult(), features, summary, b.getState(),b.getResult());

		return buildDTO;
	}

}
