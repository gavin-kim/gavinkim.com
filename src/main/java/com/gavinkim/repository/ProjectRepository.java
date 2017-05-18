package com.gavinkim.repository;

import com.gavinkim.model.oracle.Project;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProjectRepository extends JpaRepository<Project, Integer> {
    Project findProjectById(int id);
    Project findProjectByName(String name);
}
