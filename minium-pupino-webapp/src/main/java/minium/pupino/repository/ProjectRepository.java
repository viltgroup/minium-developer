package minium.pupino.repository;

import minium.pupino.domain.Project;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Spring Data JPA repository for the Project entity.
 */
public interface ProjectRepository extends JpaRepository<Project, Long> {

}
