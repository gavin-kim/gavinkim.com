package com.kwanii.controller;

import com.kwanii.model.oracle.Project;
import com.kwanii.service.ProjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.Collection;

@Controller
@RequestMapping("/")
public class HomeController {

    private ProjectService projectService;

    @Autowired
    public void init(ProjectService projectService) {
        this.projectService = projectService;
    }

    @RequestMapping("/about")
    public String about() {
        return "forward:/";
    }

    @RequestMapping("/contact")
    public String contact() {
        return "forward:/";
    }

    @RequestMapping("/portfolio")
    public String portfolio() {
        return "forward:/";
    }

    @RequestMapping("/portfolio/*")
    public String project() {
        return "forward:/";
    }

    @RequestMapping(value = "/portfolio", method = RequestMethod.POST)
    @ResponseBody
    public Object getProjects() {
        return projectService.getAll();
    }
}
