package com.portofolio.portofolio_arya.Service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.portofolio.portofolio_arya.Model.Project;
import com.portofolio.portofolio_arya.Repository.ProjectRepository;


@Service
public class ProjectService {

    private final ProjectRepository projectRepository;

    public ProjectService(ProjectRepository projectRepository) {
        this.projectRepository = projectRepository;
    }

    public List<Project> semuaProject() {
        return projectRepository.findAll();
    }

    public Project updateProject(Project Project) {
        return projectRepository.save(Project);
    }
}