package com.gavinkim.model.oracle;

import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.*;
import java.io.Serializable;

/**
 * Project Sample image url and description
 */
@Entity
public class Sample implements Serializable {

    private static final long serialVersionUID = -4906434512434522342L;

    private int id;
    private String url;
    private String description;

    @Id
    @JsonIgnore
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    @Override
    public int hashCode() {
        return id;
    }

    @Override
    public boolean equals(Object obj) {
        return this == obj || obj instanceof Sample &&
            ((Sample) obj).id == id;
    }

    @Override
    public String toString() {
        return String.format("URL: %s, Description: %s", url, description);
    }
}
