package com.ecommerce.service;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ecommerce.model.PasswordResetOTP;
import com.ecommerce.model.User;
import com.ecommerce.repository.PasswordResetOTPRepository;
import com.ecommerce.repository.UserRepository;

@Service
public class PasswordResetOTPService {

    @Autowired
    private PasswordResetOTPRepository otpRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EmailService emailService;

    public void sendOTP(String email) {
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));

        String otp = String.format("%06d", new SecureRandom().nextInt(999999));

        PasswordResetOTP resetOTP = new PasswordResetOTP(email, otp, 10); // valid for 10 mins
        otpRepository.save(resetOTP);

        String subject = "OTP for Password Reset";
        String htmlContent = createOtpEmail(user.getName(), otp);

        emailService.sendEmail(email, subject, htmlContent);
    }

    public boolean verifyOTP(String email, String otp) {
        Optional<PasswordResetOTP> optionalOTP = otpRepository.findByEmailAndOtpAndUsedFalse(email, otp);

        if (optionalOTP.isEmpty()) return false;

        PasswordResetOTP resetOTP = optionalOTP.get();

        if (resetOTP.getExpiryTime().isBefore(LocalDateTime.now())) {
            return false;
        }

        resetOTP.setUsed(true);
        otpRepository.save(resetOTP);

        return true;
    }

    public static String createOtpEmail(String customerName, String otp) {
    return "<html>" +
           "<body style='font-family: Arial, sans-serif; margin: 20px;'>" +
           "<div style='max-width: 500px; margin: 0 auto; border: 1px solid #ddd; padding: 24px; border-radius: 8px;'>" +
           "<h2 style='color: #0d6efd; text-align: center;'>Your OTP Code</h2>" +
           "<p>Dear " + customerName + ",</p>" +
           "<p>Use the following One-Time Password (OTP) to complete your action:</p>" +
           "<div style='text-align: center; margin: 24px 0;'>" +
           "<span style='display: inline-block; font-size: 2em; letter-spacing: 8px; background: #f5f5f5; padding: 12px 32px; border-radius: 6px; color: #222; font-weight: bold;'>" +
           otp +
           "</span></div>" +
           "<p style='color: #888;'>This OTP is valid for 10 minutes. Please do not share it with anyone.</p>" +
           "<p>If you did not request this, please ignore this email.</p>" +
           "<p style='text-align: center; margin-top: 32px; color: #666;'>Thank you,<br/>RMR Digital Mart Team</p>" +
           "</div>" +
           "</body>" +
           "</html>";
    }
}
