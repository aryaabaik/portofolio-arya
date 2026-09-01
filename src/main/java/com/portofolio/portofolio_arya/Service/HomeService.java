package com.portofolio.portofolio_arya.Service;

import java.util.List;
import java.util.Optional;
import org.springframework.stereotype.Service;

import com.portofolio.portofolio_arya.Model.Home;
import com.portofolio.portofolio_arya.Repository.HomeRepository;

@Service
public class HomeService {

    private final HomeRepository homeRepository;
    
    public HomeService(HomeRepository homeRepository) {
        this.homeRepository = homeRepository;
    }

    public List<Home> findAll() {
        return homeRepository.findAll();
    }

    public Optional<Home> findById(Long id) {
        return homeRepository.findById(id);
    }

    public Home getHome() {
        return homeRepository.findAll()
                .stream()
                .findFirst()
                .orElse(null);
    }

    public Home save(Home home) {
        return homeRepository.save(home);
    }

    public void deleteById(Long id) {
        homeRepository.deleteById(id);
    }
}