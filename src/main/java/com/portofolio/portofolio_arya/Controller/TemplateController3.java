package com.portofolio.portofolio_arya.Controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

import com.portofolio.portofolio_arya.Model.Profile;
import com.portofolio.portofolio_arya.Repository.ProfileRepository;
import com.portofolio.portofolio_arya.Util.FileUploadUtil;

import java.io.IOException;

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
    public String updateprofile(
            @ModelAttribute("profile") Profile profile,
            @RequestParam(value = "fotoFile", required = false) MultipartFile fotoFile,
            @RequestParam(value = "foto2File", required = false) MultipartFile foto2File,
            @RequestParam(value = "cvFile", required = false) MultipartFile cvFile) throws IOException {

        if (profile.getId() != null) {
            Profile existing = profileRepository.findById(profile.getId()).orElse(null);
            if (existing != null) {
                // Foto 1
                if (fotoFile != null && !fotoFile.isEmpty()) {
                    String fileName = FileUploadUtil.saveFile(fotoFile);
                    profile.setFoto(fileName);
                } else if (profile.getFoto() == null || profile.getFoto().trim().isEmpty()) {
                    profile.setFoto(existing.getFoto());
                }

                // Foto 2
                if (foto2File != null && !foto2File.isEmpty()) {
                    String fileName = FileUploadUtil.saveFile(foto2File);
                    profile.setFoto2(fileName);
                } else if (profile.getFoto2() == null || profile.getFoto2().trim().isEmpty()) {
                    profile.setFoto2(existing.getFoto2());
                }

                // CV File
                if (cvFile != null && !cvFile.isEmpty()) {
                    String fileName = FileUploadUtil.saveFile("pdf", cvFile);
                    profile.setCv(fileName);
                } else if (profile.getCv() == null || profile.getCv().trim().isEmpty()) {
                    profile.setCv(existing.getCv());
                }
            }
        }

        profileRepository.save(profile);
        return "redirect:/template3";
    }

    // @GetMapping("/delete/{id}")
    // public String deleteProfile(@PathVariable Long id) {
    //     profileRepository.deleteById(id);
    //     return "redirect:/template3";
    // }
}