package com.portofolio.portofolio_arya.Service;

import java.util.List;
import java.util.Optional;
import org.springframework.stereotype.Service;

import com.portofolio.portofolio_arya.Model.Kontak;
import com.portofolio.portofolio_arya.Repository.KontakRepository;


@Service

public class KontakService {
    private final KontakRepository kontakRepository;

    KontakService(KontakRepository kontakRepository) {
        this.kontakRepository = kontakRepository;
    }

    public List<Kontak> findAll() {
        return kontakRepository.findAll();
    }

    public Optional<Kontak> findById(Long id) {
        return kontakRepository.findById(id);
    }

    public Kontak getKontak() {
        return kontakRepository.findAll()
        .stream()
        .findFirst()
        .orElse(null);
    }

    public Kontak save(Kontak kontak) {
        return kontakRepository.save(kontak);
    }

    public void deleteById(Long id) {
        kontakRepository.deleteById(id);
    }
}
