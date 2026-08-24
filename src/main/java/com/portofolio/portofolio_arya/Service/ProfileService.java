package com.portofolio.portofolio_arya.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.portofolio.portofolio_arya.Model.Profile;
import com.portofolio.portofolio_arya.Repository.ProfileRepository;

@Service
public class ProfileService {

    @Autowired
    private ProfileRepository profileRepository;

    public Profile getProfile() {
        return profileRepository.findAll()
                .stream()
                .findFirst()
                .orElse(null);
    }

    public Profile updateProfile(Profile profile) {
        return profileRepository.save(profile);
    }
}