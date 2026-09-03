package com.portofolio.portofolio_arya.Controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import com.portofolio.portofolio_arya.Model.Profile;
import com.portofolio.portofolio_arya.Repository.ProfileRepository;
import com.portofolio.portofolio_arya.Model.Keahlian;
import com.portofolio.portofolio_arya.Repository.KeahlianRepository;
import com.portofolio.portofolio_arya.Model.Project;
import com.portofolio.portofolio_arya.Repository.ProjectRepository;
import com.portofolio.portofolio_arya.Model.Kontak;
import com.portofolio.portofolio_arya.Repository.KontakRepository;
import java.util.List;

@Controller
public class ProfileController {

    private final ProfileRepository profileRepository;
    private final KeahlianRepository keahlianRepository;
    private final ProjectRepository projectRepository;
    private final KontakRepository kontakRepository;
    public ProfileController(
            ProfileRepository profileRepository,
            KeahlianRepository keahlianRepository,
            ProjectRepository projectRepository,
            KontakRepository kontakRepository) {

        this.profileRepository = profileRepository;
        this.keahlianRepository = keahlianRepository;
        this.projectRepository = projectRepository;
        this.kontakRepository = kontakRepository;
    }

    @GetMapping("/profile")
    public String profile(Model model) {
        Profile profile = profileRepository.findAll().stream().findFirst().orElse(null);
        List<Keahlian> keahlian = keahlianRepository.findAll();
        List<Project> projects = projectRepository.findAll();
        List<Kontak> kontaks = kontakRepository.findAll();

        model.addAttribute("profile", profile);
        model.addAttribute("keahlian", keahlian);
        model.addAttribute("projects", projects);
        model.addAttribute("kontaks", kontaks);
        model.addAttribute("kontakList", kontaks);
        

        return "profile";
    }
}
