package com.gavinkim.controller;

import com.gavinkim.service.ProjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
public class ProjectController {

    private ProjectService projectService;

    @Autowired
    public ProjectController(ProjectService projectService) {
        this.projectService = projectService;
    }

    @RequestMapping(value = "/projects.json")
    public Object getProjects() {
        return projectService.getAll();
    }

    @RequestMapping(value = "/projects/{name}.json", method = RequestMethod.GET)
    public Object getProjectByName(@PathVariable("name") String name) {
        return projectService.getProjectByName(name);
    }
}
