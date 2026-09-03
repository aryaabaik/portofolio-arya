package com.portofolio.portofolio_arya.Controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import com.portofolio.portofolio_arya.Model.Profile;
import com.portofolio.portofolio_arya.Repository.ProfileRepository;

@Controller
@RequestMapping("/template3")
public class TemplateController3 {

    private final ProfileRepository profileRepository;

    public TemplateController3(ProfileRepository profileRepository) {
        this.profileRepository = profileRepository;
    }

    @GetMapping
    public String profile(Model model) {
        model.addAttribute("profileList", profileRepository.findAll());
        return "dashboard/profile/index";
    }

    @GetMapping("/edit/{id}")
    public String editprofile(@PathVariable Long id, Model model) {
        Profile profile = profileRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("profile tidak ada"));

        model.addAttribute("profile", profile);
        return "dashboard/profile/index3";
    }

    @PostMapping({"", "/edit"})
    public String updateprofile(@ModelAttribute("profile") Profile profile) {
        profileRepository.save(profile);
        return "redirect:/template3";
    }

    // @GetMapping("/delete/{id}")
    // public String deleteProfile(@PathVariable Long id) {
    //     profileRepository.deleteById(id);
    //     return "redirect:/template3";
    // }
}