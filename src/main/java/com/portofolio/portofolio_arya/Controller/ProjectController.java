package com.portofolio.portofolio_arya.Controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import com.portofolio.portofolio_arya.Model.Project;
import com.portofolio.portofolio_arya.Repository.ProjectRepository;

@Controller
@RequestMapping("/project")
public class ProjectController {

    private ProjectRepository projectRepository;

    public ProjectController(ProjectRepository projectRepository) {
        this.projectRepository = projectRepository;
    }
    @GetMapping
    public String project(Model model) {
        model.addAttribute("projectList", projectRepository.findAll());
        return "dashboard/project/index";
    }
    @GetMapping("/create")
    public String createProject(Model model) {
        model.addAttribute("project", new Project());
        return "dashboard/project/create";
    }
    @PostMapping("/create")
    public String simpanProject(@ModelAttribute("project") Project project) {
        projectRepository.save(project);
        return "redirect:/project";
    }
    @GetMapping("/edit/{id}")
    public String editproject(@PathVariable("id") Long id, Model model) {
        Project project = projectRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Project tidak ditemukan"));

        model.addAttribute("project", project);
        return "dashboard/project/edit";
    }
    @PostMapping("/edit")
    public String updateproject(@ModelAttribute("project") Project project) {
        projectRepository.save(project);
        return "redirect:/project";
    }
    @GetMapping("/delete/{id}")
    public String deleteProject(@PathVariable("id") Long id) {
        projectRepository.deleteById(id);
        return "redirect:/project";
    }
}
