package com.portofolio.portofolio_arya.Repository;

import com.portofolio.portofolio_arya.Model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByUsername(String username);
}