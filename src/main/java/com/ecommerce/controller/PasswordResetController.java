package com.ecommerce.controller;

import org.springframework.web.bind.annotation.RestController;

import com.ecommerce.ServiceInterface.UserService;
import com.ecommerce.model.User;
import com.ecommerce.service.PasswordResetOTPService;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.http.HttpStatus;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;


@RestController
@RequestMapping("/auth")
public class PasswordResetController {

    @Autowired
    private PasswordResetOTPService otpService;

    @Autowired
    private UserService userService;

    @Autowired
    PasswordEncoder passwordEncoder;

   @PostMapping("/forgot-password")
    public ResponseEntity<Map<String, Object>> forgotPassword(@RequestBody Map<String, String> payload) {
        String email = payload.get("email");
        Map<String, Object> response = new HashMap<>();

        try {
            otpService.sendOTP(email);
            response.put("success", true);
            response.put("message", "OTP sent to your email.");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Failed to send OTP: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @PostMapping("/verify-password")
    public ResponseEntity<Map<String, Object>> resetPassword(@RequestBody Map<String, String> payload) {
        String email = payload.get("email");
        String otp = payload.get("otp");

        boolean isValid = otpService.verifyOTP(email, otp);
        Map<String, Object> response = new HashMap<>();

        if (!isValid) {
            response.put("success", false);
            response.put("message", "Invalid or expired OTP");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }

        response.put("success", true);
        response.put("message", "OTP verified successfully. You can now reset your password.");
        return ResponseEntity.ok(response);
    }


    @PostMapping("/save-password")
    public ResponseEntity<Map<String, Object>> savePassword(@RequestBody Map<String, String> payload) {
        Map<String, Object> response = new HashMap<>();

        String email = payload.get("email");
        String password = payload.get("password");

        if (password == null || password.isEmpty()) {
            response.put("success", false);
            response.put("message", "Password cannot be empty.");
            return ResponseEntity.badRequest().body(response);
        }

        User entity = userService.getUserByEmail(email);

        if (entity == null) {
            response.put("success", false);
            response.put("message", "User not found.");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }

        entity.setPassword(passwordEncoder.encode(password));
        userService.updateUser(entity);

        response.put("success", true);
        response.put("message", "Password updated successfully.");
        return ResponseEntity.ok(response); 
    }    
}
