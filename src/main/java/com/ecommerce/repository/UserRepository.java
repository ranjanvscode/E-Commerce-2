package com.ecommerce.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ecommerce.model.User;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User,String> {

    public Optional<User> findByEmail(String email);

    public Optional<User> findByEmailAndPassword(String email,String password);
}

