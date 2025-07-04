package com.ecommerce.RequestForm;

import org.springframework.web.multipart.MultipartFile;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class ProfileRequest {

    private String name;
    private String email;
    private String phone;
    private MultipartFile image;
}
