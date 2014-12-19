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

	public void save(List<BuildDTO> buildsDTO, Project p) {
		for (BuildDTO buildDTO : buildsDTO) {
			Build build = new Build();
			build.setName(buildDTO.getFullDisplayName());
			build.setArtifact(buildDTO.getResultJSON());
			build.setNumber(buildDTO.getNumber());
			build.setDuration(buildDTO.getDuration());

			build.setResult(buildDTO.getResult());
			build.setTimestamp(buildDTO.getTimestamp());
			build.setKey(buildDTO.getKey());
			build.setProject(p);
			buildRepository.save(build);
		}
	}

	public List<BuildDTO> findAll() throws IOException, URISyntaxException {
		List<Build> builds = buildRepository.findAll();
		List<BuildDTO> buildsDTO = Lists.newArrayList();
		BuildDTO buildDTO;
		SummaryDTO summary = null;
		for (Build b : builds) {
			String result = b.getResult();
			List<Feature> features = reporter.parseJsonResult(b.getArtifact());
			summary = reporter.getSummaryFromFeatures(features);
			buildDTO = new BuildDTO(b.getId() ,Integer.valueOf(b.getNumber()), "", false, "", b.getDuration(), b.getName(), b.getKey(), b.getTimestamp(), result,
					"", null, summary);
			buildsDTO.add(buildDTO);
		}

		return buildsDTO;
	}

	public List<BuildDTO> findByProject(Project project) throws IOException, URISyntaxException {
		List<Build> builds = buildRepository.findByProject(project);
		List<BuildDTO> buildsDTO = Lists.newArrayList();
		BuildDTO buildDTO;
		boolean lastBuild = true;
		SummaryDTO summary = null;
		for (Build b : builds) {
			String result = b.getResult();
			// only want the report of the lastBuild finished
			if (lastBuild) {
				// get the artifact of the build and return the string
				lastBuild = false;
				List<Feature> features = reporter.parseJsonResult(b.getArtifact());
				summary = reporter.getSummaryFromFeatures(features);
				buildDTO = new BuildDTO(b.getId(),Integer.valueOf(b.getNumber()), "", false, "", b.getDuration(), b.getName(), b.getKey(), b.getTimestamp(),
						result, "", features, summary);
			} else {
				List<Feature> features = reporter.parseJsonResult(b.getArtifact());
				summary = reporter.getSummaryFromFeatures(features);
				buildDTO = new BuildDTO(b.getId(),Integer.valueOf(b.getNumber()), "", false, "", b.getDuration(), b.getName(), b.getKey(), b.getTimestamp(),
						result, "", null, summary);
			}
			buildsDTO.add(buildDTO);
		}
		return buildsDTO;
	}
	
	public BuildDTO findOne(Long id) throws JsonSyntaxException, JsonIOException, FileNotFoundException{
		Build b = buildRepository.findOne(id);
		List<Feature> features = reporter.parseJsonResult(b.getArtifact());
		SummaryDTO summary = reporter.getSummaryFromFeatures(features);
		BuildDTO buildDTO = new BuildDTO(b.getId(),Integer.valueOf(b.getNumber()), "", false, "", b.getDuration(), b.getName(), b.getKey(), b.getTimestamp(),
				b.getResult(), "", features, summary);
		return buildDTO;
	}
	
	public BuildDTO findByFeature(int id,String featureURI) throws JsonSyntaxException, JsonIOException, FileNotFoundException{
		Build b = buildRepository.findOne((long) id);
		Map<String, Feature> features = reporter.parseJsonResultSet(b.getArtifact());
		Feature f = features.get(featureURI);
		f.processSteps();
		
		BuildDTO buildDTO = new BuildDTO(b.getId(),Integer.valueOf(b.getNumber()), "", false, "", b.getDuration(), b.getName(), b.getKey(), b.getTimestamp(),
				b.getResult(), "", Arrays.asList(f), null);
		return buildDTO;
	}
	//REFACTOR THIS METHOD
	public BuildDTO findLastBuild(Project project) throws JsonSyntaxException, JsonIOException, FileNotFoundException {
		Build b = buildRepository.findLastBuild(project,new PageRequest(0,1)).get(0);
		List<Feature> features = reporter.parseJsonResult(b.getArtifact());
		SummaryDTO summary = reporter.getSummaryFromFeatures(features);
		BuildDTO buildDTO = new BuildDTO(b.getId(),Integer.valueOf(b.getNumber()), "", false, "", b.getDuration(), b.getName(), b.getKey(), b.getTimestamp(),
				b.getResult(), "", features, summary);
		return buildDTO;
	}
	
	
	
}
