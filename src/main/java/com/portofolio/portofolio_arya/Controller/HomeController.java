package com.portofolio.portofolio_arya.Controller;

import com.portofolio.portofolio_arya.Model.Home;
import com.portofolio.portofolio_arya.Repository.HomeRepository;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/dashboard/home")
public class HomeController {

    private final HomeRepository homeRepository;

    public HomeController(HomeRepository homeRepository) {
        this.homeRepository = homeRepository;
    }

    @GetMapping({"", "/"})
    public String home(Model model) {

        Home home = homeRepository.findById(1L)
                .orElseThrow(() -> new RuntimeException("Data Home tidak ada"));

        model.addAttribute("home", home);

        return "dashboard/home/index";
    }

    @GetMapping("/edit")
    public String editHome(Model model) {

        Home home = homeRepository.findById(1L)
                .orElseThrow(() -> new RuntimeException("Data Home tidak ada"));

        model.addAttribute("home", home);

        return "dashboard/home/edit";
    }

    @PostMapping("/edit")
    public String updateHome(Home home) {

        homeRepository.save(home);

        return "redirect:/dashboard/home";
    }
}