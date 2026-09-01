package com.portofolio.portofolio_arya.Controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import com.portofolio.portofolio_arya.Model.Home;
import com.portofolio.portofolio_arya.Service.HomeService;

@Controller
@RequestMapping("/dashboard/home")
public class HomeController {

    private final HomeService homeService;

    public HomeController(HomeService homeService) {
        this.homeService = homeService;
    }

    @GetMapping({"", "/"})
    public String home(Model model) {
        Home home = homeService.getHome();
        if (home == null) {
            home = new Home();
            home.setNama("Arya Adhitya");
            home.setFoto("tampan.png");
            home.setDeskripsi("Siswa XII RPL 3 yang sedang belajar Java dan Spring Boot.");
            home.setPendidikan("SMK ASSALAAM BANDUNG");
        }
        model.addAttribute("home", home);
        return "dashboard/home/index";
    }

    @GetMapping("/edit")
    public String editHome(Model model) {
        Home home = homeService.getHome();
        if (home == null) {
            home = new Home();
            home.setNama("Arya Adhitya");
            home.setFoto("tampan.png");
            home.setDeskripsi("Siswa XII RPL 3 yang sedang belajar Java dan Spring Boot.");
            home.setPendidikan("SMK ASSALAAM BANDUNG");
        }
        model.addAttribute("home", home);
        return "dashboard/home/edit";
    }

    @PostMapping("/edit")
    public String updateHome(Home home) {
        homeService.save(home);
        return "redirect:/dashboard/home";
    }
}