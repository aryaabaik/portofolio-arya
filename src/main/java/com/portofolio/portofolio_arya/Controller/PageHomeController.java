package com.portofolio.portofolio_arya.Controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import com.portofolio.portofolio_arya.Model.Home;
import com.portofolio.portofolio_arya.Service.HomeService;

@Controller
public class PageHomeController {

    private final HomeService homeService;

    public PageHomeController(HomeService homeService) {
        this.homeService = homeService;
    }

    @GetMapping({"/", "/home"})
    public String homePage(Model model) {
        Home home = homeService.getHome();
        model.addAttribute("home", home);
        return "home";
    }
}
