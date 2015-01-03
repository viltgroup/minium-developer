package minium.pupino.repository;

import java.util.List;

import minium.pupino.domain.Build;
import minium.pupino.domain.Project;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

/**
 * Spring Data JPA repository for the Build entity.
 */
public interface BuildRepository extends JpaRepository<Build, Long>	 {
	
    public List<Build> findByProject(@Param("project") Project project);
    
    //@Query("SELECT b FROM Build b where b.id = (SELECT MAX(number) from Build where project= :project_val ) ")
    @Query("SELECT b FROM Build b where b.project= :project_val ORDER BY b.number DESC ")
    public List<Build> findLastBuild(@Param("project_val") Project project,Pageable page);
}
