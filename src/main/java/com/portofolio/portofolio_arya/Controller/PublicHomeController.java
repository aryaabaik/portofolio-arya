package com.portofolio.portofolio_arya.Controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import com.portofolio.portofolio_arya.Model.Home;
import com.portofolio.portofolio_arya.Service.HomeService;

@Controller
public class PublicHomeController {

    private final HomeService homeService;

    public PublicHomeController(HomeService homeService) {
        this.homeService = homeService;
    }

    @GetMapping({"/", "/home"})
    public String homePage(Model model) {
        Home home = homeService.getHome();
        if (home == null) {
            home = new Home();
            home.setNama("Arya Adhitya");
            home.setFoto("tampan.png");
            home.setDeskripsi("Siswa XII RPL 3 yang sedang belajar Java dan Spring Boot.");
            home.setPendidikan("SMK ASSALAAM BANDUNG");
        }

        model.addAttribute("home", home);
        return "home";
    }
}
