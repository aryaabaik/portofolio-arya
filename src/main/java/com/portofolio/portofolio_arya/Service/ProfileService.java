package com.portofolio.portofolio_arya.Service;

import java.util.List;
import java.util.Optional;
import org.springframework.stereotype.Service;

import com.portofolio.portofolio_arya.Model.Profile;
import com.portofolio.portofolio_arya.Repository.ProfileRepository;

@Service
public class ProfileService {

    private final ProfileRepository profileRepository;

    public ProfileService(ProfileRepository profileRepository) {
        this.profileRepository = profileRepository;
    }

    public List<Profile> findAll() {
        return profileRepository.findAll();
    }

    public Optional<Profile> findById(Long id) {
        return profileRepository.findById(id);
    }

    public Profile getProfile() {
        return profileRepository.findAll()
                .stream()
                .findFirst()
                .orElse(null);
    }

    public Profile save(Profile profile) {
        return profileRepository.save(profile);
    }

    public void deleteById(Long id) {
        profileRepository.deleteById(id);
    }
}