package com.kwanii.model.oracle;

import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.*;
import java.io.Serializable;

/**
 * Project Sample image url and description
 */
@Entity
public class Sample implements Serializable {

    private static final long serialVersionUID = -4906434512434522342L;

    private String sampleId;
    private String url;
    private String description;
    @JsonIgnore
    private Project project;

    @Id
    public String getSampleId() {
        return sampleId;
    }

    public void setSampleId(String sampleId) {
        this.sampleId = sampleId;
    }

    public String getSrc() {
        return url;
    }

    public void setSrc(String url) {
        this.url = url;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    @ManyToOne(optional = false)
    // projectId: foreign key in the table
    @JoinColumn(name = "projectId", nullable = false)
    public Project getProject() {
        return project;
    }

    public void setProject(Project project) {
        this.project = project;
    }

    @Override
    public int hashCode() {
        return sampleId.hashCode();
    }

    @Override
    public boolean equals(Object obj) {
        return this == obj || obj instanceof Sample &&
            ((Sample) obj).sampleId.equals(sampleId);
    }

    @Override
    public String toString() {
        return String.format("URL: %s, Description: %s", url, description);
    }
}
