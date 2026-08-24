package com.portofolio.portofolio_arya.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import com.portofolio.portofolio_arya.Model.Profile;
import com.portofolio.portofolio_arya.Service.ProfileService;

@Controller
@RequestMapping("/template3")
public class TemplateController3 {

    @Autowired
    private ProfileService profileService;

    @GetMapping
    public String template(Model model) {

        Profile profile = profileService.getProfile();

        model.addAttribute("profile", profile);

        return "index3";
    }

    @PostMapping
    public String template(@ModelAttribute("profile") Profile profile,
                           Model model) {

        profileService.updateProfile(profile);

        model.addAttribute("profile", profile);
        model.addAttribute("message", "Profile berhasil diubah!");

        return "index3";
    }
}