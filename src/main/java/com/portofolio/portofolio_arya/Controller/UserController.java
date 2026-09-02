package com.portofolio.portofolio_arya.Controller;

import com.portofolio.portofolio_arya.Model.User;
import com.portofolio.portofolio_arya.Repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class UserController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserController(UserRepository userRepository,
                          PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @GetMapping("/buat-user")
    public String buatUser() {

        User user = new User();

        user.setUsername("aryaaa");
        user.setPassword(passwordEncoder.encode("password"));

        userRepository.save(user);

        return "User berhasil dibuat";
    }
}