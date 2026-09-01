package com.portofolio.portofolio_arya.Controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import com.portofolio.portofolio_arya.Model.Profile;
import com.portofolio.portofolio_arya.Service.ProfileService;
import com.portofolio.portofolio_arya.Model.Keahlian;
import com.portofolio.portofolio_arya.Repository.KeahlianRepository;
import com.portofolio.portofolio_arya.Model.Project;
import com.portofolio.portofolio_arya.Repository.ProjectRepository;
import com.portofolio.portofolio_arya.Model.Kontak;
import com.portofolio.portofolio_arya.Repository.KontakRepository;
import com.portofolio.portofolio_arya.Model.Home;
import com.portofolio.portofolio_arya.Repository.HomeRepository;
import java.util.List;

@Controller
public class ProfileController {

    private final ProfileService profileService;
    private final KeahlianRepository keahlianRepository;
    private final ProjectRepository projectRepository;
    private final KontakRepository kontakRepository;
    private final HomeRepository homerepository;
    public ProfileController(
            ProfileService profileService,
            KeahlianRepository keahlianRepository,
            ProjectRepository projectRepository,
            KontakRepository kontakRepository,
            HomeRepository homerepository) {

        this.profileService = profileService;
        this.keahlianRepository = keahlianRepository;
        this.projectRepository = projectRepository;
        this.kontakRepository = kontakRepository;
        this.homerepository = homerepository;
    }

    @GetMapping("/profile")
    public String profile(Model model) {
        Profile profile = profileService.getProfile();
        List<Keahlian> keahlian = keahlianRepository.findAll();
        List<Project> projects = projectRepository.findAll();
        List<Kontak> kontaks = kontakRepository.findAll();
        List<Home> homes = homerepository.findAll();

        model.addAttribute("profile", profile);
        model.addAttribute("keahlian", keahlian);
        model.addAttribute("projects", projects);
        model.addAttribute("kontaks", kontaks);
        model.addAttribute("kontakList", kontaks);
        model.addAttribute("home", homes);

        return "profile";
    }
}
