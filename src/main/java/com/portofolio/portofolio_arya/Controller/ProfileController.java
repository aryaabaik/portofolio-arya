package com.portofolio.portofolio_arya.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import com.portofolio.portofolio_arya.Model.Profile;
import com.portofolio.portofolio_arya.Service.ProfileService;

@Controller
@RequestMapping("/")
public class ProfileController {

    @Autowired
    private ProfileService profileService;

    @GetMapping("/profile")
    public String profile(Model model) {

        Profile profile = profileService.getProfile();

        model.addAttribute("profile", profile);

        return "profile";
    }
}