package com.gavinkim.service.impl;

import com.gavinkim.model.oracle.Project;
import com.gavinkim.repository.ProjectRepository;
import com.gavinkim.service.ProjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collection;


@Service
public class ProjectServiceImpl implements ProjectService {

    private ProjectRepository projectRepository;

    @Autowired
    public void init(ProjectRepository projectRepository) {
        this.projectRepository = projectRepository;
    }

    @Transactional
    @Override
    public Collection<Project> getAll() {

        return projectRepository.findAll();
    }
}
