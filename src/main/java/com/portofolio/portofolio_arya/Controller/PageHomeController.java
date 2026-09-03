package com.portofolio.portofolio_arya.Controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import com.portofolio.portofolio_arya.Model.Home;
import com.portofolio.portofolio_arya.Repository.HomeRepository;

@Controller
public class PageHomeController {

    private final HomeRepository homeRepository;

    public PageHomeController(HomeRepository homeRepository) {
        this.homeRepository = homeRepository;
    }

    @GetMapping({"/", "/home"})
    public String homePage(Model model) {
        Home home = homeRepository.findAll().stream().findFirst().orElse(null);
        model.addAttribute("home", home);
        return "home";
    }
}
