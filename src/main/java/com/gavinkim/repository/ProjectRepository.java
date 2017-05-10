package com.gavinkim.repository;

import com.gavinkim.model.oracle.Project;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProjectRepository extends JpaRepository<Project, Integer> {

}
