package com.kwanii.model.oracle;

import javax.persistence.*;
import java.io.Serializable;
import java.util.*;

/**
 * Project Information
 */
@Entity
public class Project implements Serializable {

    private static final long serialVersionUID = -4098745524255674533L;

    private String projectId;
    private String title;
    private String version;
    private String creator;
    private String year;
    private String language;
    private String technology;
    private String gitHub;
    private String link;
    private String description;
    private Collection<Sample> samples;

    @Id
    @Column(name = "projectId")
    public String getProjectId() {
        return projectId;
    }

    public void setProjectId(String projectId) {
        this.projectId = projectId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getVersion() {
        return version;
    }

    public void setVersion(String version) {
        this.version = version;
    }

    public String getCreator() {
        return creator;
    }

    public void setCreator(String creator) {
        this.creator = creator;
    }

    public String getYear() {
        return year;
    }

    public void setYear(String year) {
        this.year = year;
    }

    public String getLanguage() {
        return language;
    }

    public void setLanguage(String language) {
        this.language = language;
    }

    public String getTechnology() {
        return technology;
    }

    public void setTechnology(String technology) {
        this.technology = technology;
    }

    public String getGitHub() {
        return gitHub;
    }

    public void setGitHub(String gitHub) {
        this.gitHub = gitHub;
    }

    public String getLink() {
        return link;
    }

    public void setLink(String link) {
        this.link = link;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    @OneToMany(fetch = FetchType.EAGER, // prevent lazy init
               mappedBy = "project",    // project property in Sample class
               cascade = CascadeType.ALL)
    public Collection<Sample> getSamples() {
        return samples;
    }

    public void setSamples(Collection<Sample> samples) {
        this.samples = samples;
    }

    @Override
    public int hashCode() {

        return projectId.hashCode();
    }

    @Override
    public boolean equals(Object obj) {

        return this == obj || obj instanceof Project &&
            ((Project) obj).projectId.equals(projectId);
    }

    @Override
    public String toString() {
        return String.format("Title: %s, Version: %s", title, version);
    }
}
