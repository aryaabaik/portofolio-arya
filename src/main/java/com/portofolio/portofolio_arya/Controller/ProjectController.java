package com.portofolio.portofolio_arya.Controller;

import com.portofolio.portofolio_arya.Model.Project;
import com.portofolio.portofolio_arya.Repository.ProjectRepository;
import com.portofolio.portofolio_arya.Util.FileUploadUtil;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.io.IOException;
import java.util.Arrays;
import java.util.List;
import java.util.function.Consumer;

@Controller
@RequestMapping("/project")
public class ProjectController {

    private final ProjectRepository projectRepository;

    public ProjectController(ProjectRepository projectRepository) {
        this.projectRepository = projectRepository;
    }

    @GetMapping
    public String project(Model model) {
        model.addAttribute("projectList", projectRepository.findAll());
        return "dashboard/project/index";
    }

    @GetMapping("/create")
    public String createProject(Model model) {
        model.addAttribute("project", new Project());
        return "dashboard/project/create";
    }

    @PostMapping("/create")
    public String simpanProject(
            @ModelAttribute("project") Project project,
            @RequestParam(value = "imageFiles", required = false) List<MultipartFile> imageFiles) throws IOException {

        savePhotos(imageFiles, Arrays.asList(
            project::setFoto,
            project::setFoto2,
            project::setFoto3,
            project::setFoto4,
            project::setFoto5
        ));

        projectRepository.save(project);
        return "redirect:/project";
    }

    @GetMapping("/edit/{id}")
    public String editproject(@PathVariable Long id, Model model) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Project tidak ditemukan"));
        model.addAttribute("project", project);
        return "dashboard/project/edit";
    }

    @PostMapping("/edit")
    public String updateproject(
            @ModelAttribute("project") Project project,
            @RequestParam(value = "removedPhotoIndexes", required = false) List<Integer> removedPhotoIndexes,
            @RequestParam(value = "imageFiles", required = false) List<MultipartFile> imageFiles) throws IOException {

        Project existing = project.getId() != null
                ? projectRepository.findById(project.getId()).orElse(null)
                : null;

        List<Consumer<String>> setters = Arrays.asList(
            project::setFoto,
            project::setFoto2,
            project::setFoto3,
            project::setFoto4,
            project::setFoto5
        );

        Project photoSource = existing != null ? existing : project;
        List<String> photos = new ArrayList<>();
        List<String> existingPhotos = Arrays.asList(photoSource.getFoto(), photoSource.getFoto2(),
            photoSource.getFoto3(), photoSource.getFoto4(), photoSource.getFoto5());

        for (int i = 0; i < existingPhotos.size(); i++) {
            String photo = existingPhotos.get(i);
            if (photo != null && !photo.isBlank()
                && (removedPhotoIndexes == null || !removedPhotoIndexes.contains(i))) {
            photos.add(photo);
            }
        }

        if (imageFiles != null) {
            for (MultipartFile file : imageFiles) {
                if (photos.size() == setters.size()) break;
                if (file != null && !file.isEmpty()) {
                    photos.add(FileUploadUtil.saveFile(file));
                }
            }
        }

        for (int i = 0; i < setters.size(); i++) {
            setters.get(i).accept(i < photos.size() ? photos.get(i) : null);
        }

        projectRepository.save(project);
        return "redirect:/project";
    }

    @GetMapping("/delete/{id}")
    public String deleteProject(@PathVariable Long id) {
        projectRepository.deleteById(id);
        return "redirect:/project";
    }

    // ---- Helpers ----

    private void savePhotos(List<MultipartFile> files, List<Consumer<String>> setters) throws IOException {
        if (files == null) return;
        for (int i = 0; i < Math.min(files.size(), setters.size()); i++) {
            MultipartFile f = files.get(i);
            if (f != null && !f.isEmpty()) {
                setters.get(i).accept(FileUploadUtil.saveFile(f));
            }
        }
    }

    private String getFotoByIndex(Project p, int i) {
        return switch (i) {
            case 0 -> p.getFoto();
            case 1 -> p.getFoto2();
            case 2 -> p.getFoto3();
            case 3 -> p.getFoto4();
            case 4 -> p.getFoto5();
            default -> null;
        };
    }
}
