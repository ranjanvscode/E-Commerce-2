package com.ecommerce.Configration;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Component;

@Component
public class EnvDebug {

    @PostConstruct
    public void printEnv() {
        System.out.println("===== ENV DEBUG =====");
        System.out.println("CLOUDINARY_CLOUD_NAME: " + System.getenv("CLOUDINARY_CLOUD_NAME"));
        System.out.println("CLOUDINARY_API_KEY: " + System.getenv("CLOUDINARY_API_KEY"));
        System.out.println("CLOUDINARY_API_SECRET: " + System.getenv("CLOUDINARY_API_SECRET"));
        System.out.println("BREVO_API_SECRET: " + System.getenv("BREVO_API_KEY"));
        System.out.println("======================");
    }
}
