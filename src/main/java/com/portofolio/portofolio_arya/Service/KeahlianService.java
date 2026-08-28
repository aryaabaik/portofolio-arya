package com.portofolio.portofolio_arya.Service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.portofolio.portofolio_arya.Model.Keahlian;
import com.portofolio.portofolio_arya.Repository.KeahlianRepository;


@Service
public class KeahlianService {

    private final KeahlianRepository keahlianRepository;

    public KeahlianService(KeahlianRepository keahlianRepository) {
        this.keahlianRepository = keahlianRepository;
    }

    public List<Keahlian> semuaKeahlian() {
        return keahlianRepository.findAll();
    }

    public Keahlian updateKeahlian(Keahlian keahlian) {
        return keahlianRepository.save(keahlian);
    }
}