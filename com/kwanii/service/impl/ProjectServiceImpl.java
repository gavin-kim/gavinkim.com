package com.kwanii.service.impl;

import com.kwanii.model.oracle.Project;
import com.kwanii.repository.ProjectRepository;
import com.kwanii.service.ProjectService;
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
