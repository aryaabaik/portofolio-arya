package com.portofolio.portofolio_arya.Controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import com.portofolio.portofolio_arya.Service.ProfileService;
import com.portofolio.portofolio_arya.Repository.KeahlianRepository;
import com.portofolio.portofolio_arya.Repository.ProjectRepository;

@Controller
@RequestMapping("/dashboard")
public class DashboardController {

    private ProfileService profileService;
    private KeahlianRepository keahlianRepository;
    private ProjectRepository projectRepository;

    public DashboardController(ProfileService profileService, KeahlianRepository keahlianRepository, ProjectRepository projectRepository) {
        this.profileService = profileService;
        this.keahlianRepository = keahlianRepository;
        this.projectRepository = projectRepository;
    }

    @GetMapping
    public String dashboard(Model model) {
        model.addAttribute("profile", profileService.getProfile());
        model.addAttribute("totalKeahlian", keahlianRepository.count());
        model.addAttribute("totalProject", projectRepository.count());
        model.addAttribute("keahlianList", keahlianRepository.findAll());
        model.addAttribute("projectList", projectRepository.findAll());
        return "dashboard/index";
    }
}
