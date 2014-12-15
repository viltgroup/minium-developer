package minium.pupino.repository;

import java.util.List;

import minium.pupino.domain.Build;
import minium.pupino.domain.Project;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;

/**
 * Spring Data JPA repository for the Build entity.
 */
public interface BuildRepository extends JpaRepository<Build, Long>	 {
	
    public List<Build> findByProject(@Param("project") Project project);
}
