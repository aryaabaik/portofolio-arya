package com.portofolio.portofolio_arya.Controller;

import com.portofolio.portofolio_arya.Model.Keahlian;
import com.portofolio.portofolio_arya.Repository.KeahlianRepository;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping("/keahlian")
public class KeahlianController {

    private final KeahlianRepository keahlianRepository;

    public KeahlianController(KeahlianRepository keahlianRepository) {
        this.keahlianRepository = keahlianRepository;
    }

    @GetMapping
    public String keahlian(Model model) {
        model.addAttribute("keahlianList", keahlianRepository.findAll());

        return "dashboard/keahlian/index";
    }

    @GetMapping("/edit/{id}")
    public String editKeahlian(@PathVariable Long id, Model model) {
        Keahlian keahlian = keahlianRepository.findById(id).orElseThrow(() -> new RuntimeException("keahlian tidak ada"));

        model.addAttribute("keahlian", keahlian);
        return "dashboard/keahlian/edit";
    }


    @PostMapping("/edit")
    public String updateKeahlian(@ModelAttribute("keahlian") Keahlian keahlian){
            
        keahlianRepository.save(keahlian);

        return "redirect:/keahlian";
    }

    
}