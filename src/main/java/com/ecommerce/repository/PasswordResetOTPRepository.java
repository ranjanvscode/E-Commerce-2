package com.ecommerce.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ecommerce.model.PasswordResetOTP;

@Repository
public interface PasswordResetOTPRepository extends JpaRepository<PasswordResetOTP, Long> {

    Optional<PasswordResetOTP> findByEmailAndOtpAndUsedFalse(String email, String otp);
    Optional<PasswordResetOTP> findByEmailAndUsedFalse(String email);
}