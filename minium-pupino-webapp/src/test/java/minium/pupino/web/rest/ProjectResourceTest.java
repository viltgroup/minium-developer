package minium.pupino.web.rest;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.MockitoAnnotations;
import org.springframework.boot.test.SpringApplicationConfiguration;
import org.springframework.http.MediaType;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.web.WebAppConfiguration;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.PostConstruct;
import javax.inject.Inject;
import java.util.List;

import minium.pupino.Application;
import minium.pupino.domain.Project;
import minium.pupino.repository.ProjectRepository;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Test class for the ProjectResource REST controller.
 *
 * @see ProjectResource
 */
@RunWith(SpringJUnit4ClassRunner.class)
@SpringApplicationConfiguration(classes = Application.class)
@WebAppConfiguration
public class ProjectResourceTest {

    private static final String DEFAULT_NAME = "SAMPLE_TEXT";
    private static final String UPDATED_NAME = "UPDATED_TEXT";
    
    private static final String DEFAULT_DESCRIPTION = "SAMPLE_TEXT";
    private static final String UPDATED_DESCRIPTION = "UPDATED_TEXT";
    

   @Inject
   private ProjectRepository projectRepository;

   private MockMvc restProjectMockMvc;

   private Project project;

    @PostConstruct
    public void setup() {
        MockitoAnnotations.initMocks(this);
        ProjectResource projectResource = new ProjectResource();
        ReflectionTestUtils.setField(projectResource, "projectRepository", projectRepository);
        this.restProjectMockMvc = MockMvcBuilders.standaloneSetup(projectResource).build();
    }

    @Before
    public void initTest() {
        project = new Project();
        project.setName(DEFAULT_NAME);
        project.setDescription(DEFAULT_DESCRIPTION);
    }

    @Test
    @Transactional
    public void createProject() throws Exception {
        // Validate the database is empty
        assertThat(projectRepository.findAll()).hasSize(0);

        // Create the Project
        restProjectMockMvc.perform(post("/app/rest/projects")
                .contentType(TestUtil.APPLICATION_JSON_UTF8)
                .content(TestUtil.convertObjectToJsonBytes(project)))
                .andExpect(status().isOk());

        // Validate the Project in the database
        List<Project> projects = projectRepository.findAll();
        assertThat(projects).hasSize(1);
        Project testProject = projects.iterator().next();
        assertThat(testProject.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testProject.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);;
    }

    @Test
    @Transactional
    public void getAllProjects() throws Exception {
        // Initialize the database
        projectRepository.saveAndFlush(project);

        // Get all the projects
        restProjectMockMvc.perform(get("/app/rest/projects"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.[0].id").value(project.getId().intValue()))
                .andExpect(jsonPath("$.[0].name").value(DEFAULT_NAME.toString()))
                .andExpect(jsonPath("$.[0].description").value(DEFAULT_DESCRIPTION.toString()));
    }

    @Test
    @Transactional
    public void getProject() throws Exception {
        // Initialize the database
        projectRepository.saveAndFlush(project);

        // Get the project
        restProjectMockMvc.perform(get("/app/rest/projects/{id}", project.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON))
            .andExpect(jsonPath("$.id").value(project.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME.toString()))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingProject() throws Exception {
        // Get the project
        restProjectMockMvc.perform(get("/app/rest/projects/{id}", 1L))
                .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateProject() throws Exception {
        // Initialize the database
        projectRepository.saveAndFlush(project);

        // Update the project
        project.setName(UPDATED_NAME);
        project.setDescription(UPDATED_DESCRIPTION);
        restProjectMockMvc.perform(post("/app/rest/projects")
                .contentType(TestUtil.APPLICATION_JSON_UTF8)
                .content(TestUtil.convertObjectToJsonBytes(project)))
                .andExpect(status().isOk());

        // Validate the Project in the database
        List<Project> projects = projectRepository.findAll();
        assertThat(projects).hasSize(1);
        Project testProject = projects.iterator().next();
        assertThat(testProject.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testProject.getDescription()).isEqualTo(UPDATED_DESCRIPTION);;
    }

    @Test
    @Transactional
    public void deleteProject() throws Exception {
        // Initialize the database
        projectRepository.saveAndFlush(project);

        // Get the project
        restProjectMockMvc.perform(delete("/app/rest/projects/{id}", project.getId())
                .accept(TestUtil.APPLICATION_JSON_UTF8))
                .andExpect(status().isOk());

        // Validate the database is empty
        List<Project> projects = projectRepository.findAll();
        assertThat(projects).hasSize(0);
    }
}
