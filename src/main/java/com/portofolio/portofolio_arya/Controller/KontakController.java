    package com.portofolio.portofolio_arya.Controller;

    import org.springframework.stereotype.Controller;
    import org.springframework.ui.Model;

    import com.portofolio.portofolio_arya.Model.Kontak;
    import com.portofolio.portofolio_arya.Repository.KontakRepository;

    import org.springframework.web.bind.annotation.*;


    @Controller
    @RequestMapping("/kontak")
    public class KontakController {
        private final KontakRepository kontakRepository;

        public KontakController(KontakRepository kontakRepository) {
            this.kontakRepository = kontakRepository;
        }

        @GetMapping
        public String kontak(Model model) {
            model.addAttribute("kontakList", kontakRepository.findAll());
            return "dashboard/kontak/index";
        }

        @PostMapping
        public String tambahKontak(@ModelAttribute Kontak kontak) {
            kontakRepository.save(kontak);
            return "redirect:/kontak";
        }

        @GetMapping("/edit/{id}")
        public String editKontak(@PathVariable Long id, Model model) {
            Kontak kontak = kontakRepository.findById(id).orElseThrow(() -> new RuntimeException("id tidak ada"));

            model.addAttribute("kontak", kontak);
            return "dashboard/kontak/edit";
        }

        @PostMapping("/edit")
        public String updateKontak(@ModelAttribute("kontak") Kontak kontak){
                
            kontakRepository.save(kontak);

            return "redirect:/kontak";
        }
        
    }
