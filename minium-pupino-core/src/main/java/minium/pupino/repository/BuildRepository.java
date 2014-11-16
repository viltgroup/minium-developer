package minium.pupino.repository;

import minium.pupino.domain.Build;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Spring Data JPA repository for the Build entity.
 */
public interface BuildRepository extends JpaRepository<Build, Long> {

}
