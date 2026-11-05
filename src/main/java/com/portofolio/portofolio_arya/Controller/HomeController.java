package com.portofolio.portofolio_arya.Controller;

import com.portofolio.portofolio_arya.Model.Home;
import com.portofolio.portofolio_arya.Repository.HomeRepository;
import com.portofolio.portofolio_arya.Util.FileUploadUtil;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

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
    public String updateHome(
            @ModelAttribute("home") Home home,
            @RequestParam(value = "imageFile", required = false) MultipartFile imageFile) throws IOException {

        if (imageFile != null && !imageFile.isEmpty()) {
            String fileName = FileUploadUtil.saveFile(imageFile);
            home.setFoto(fileName);
        } else {
            if (home.getId() != null) {
                homeRepository.findById(home.getId()).ifPresent(existing -> {
                    if (home.getFoto() == null || home.getFoto().trim().isEmpty()) {
                        home.setFoto(existing.getFoto());
                    }
                });
            }
        }

        homeRepository.save(home);

        return "redirect:/dashboard/home";
    }
}