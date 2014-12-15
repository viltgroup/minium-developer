package minium.pupino.repository;

import java.util.List;

import minium.pupino.domain.Build;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

/**
 * Spring Data JPA repository for the Build entity.
 */
public interface BuildRepository extends JpaRepository<Build, Long> {
	
	public final static String FIND_BY_PROJECT = "SELECT b " + 
            "FROM Build b LEFT JOIN Project p ON p.id = b.project_id " +
            "WHERE b.project_id = :id";
	
	@Query(FIND_BY_PROJECT)
    public List<Build> findByProject(@Param("id") int id);
}
