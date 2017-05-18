package com.gavinkim.service;

import com.gavinkim.model.oracle.Project;

import java.util.Collection;

public interface ProjectService {
    Collection<Project> getAll();
    Project getProjectById(int id);
    Project getProjectByName(String name);
}
