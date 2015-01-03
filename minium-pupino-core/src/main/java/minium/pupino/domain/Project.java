package minium.pupino.domain;


import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

/**
 * A Project.
 */
@Entity
@Table(name = "T_PROJECT")
public class Project implements Serializable {

	private static final long serialVersionUID = -8968081733947348809L;

	@Id
    @GeneratedValue(strategy = GenerationType.TABLE)
    private Long id;

    @Column(name = "name")
    private String name;

    @Column(name = "description")
    private String description;
    
    @Column(name = "repository_type")
    private String repository_type;
    
    @Column(name = "repository_url")
    private String repository_url;
    
//    @Column(name = "source_repository")
//    @Type(type = JsonUserType.TYPE_NAME)
//    @Basic
//    @Lob
//    private SourceRepository sourceRepository;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
    
//    public SourceRepository getSourceRepository() {
//		return sourceRepository;
//	}
//    
//    public void setSourceRepository(SourceRepository sourceRepository) {
//		this.sourceRepository = sourceRepository;
//	}
    
    public String getRepository_url() {
		return repository_url;
	}

	public void setRepository_url(String repository_url) {
		this.repository_url = repository_url;
	}
    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }

        Project project = (Project) o;

        if (id != null ? !id.equals(project.id) : project.id != null) return false;

        return true;
    }

    @Override
    public int hashCode() {
        return (int) (id ^ (id >>> 32));
    }

    @Override
    public String toString() {
        return "Project{" +
                "id=" + id +
                ", name='" + name + "'" +
                ", description='" + description + "'" +
                '}';
    }

	public String getRepository_type() {
		return repository_type;
	}

	public void setRepository_type(String repository_type) {
		this.repository_type = repository_type;
	}

	
}
