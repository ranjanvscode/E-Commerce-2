package com.ecommerce.Forms;

import org.springframework.web.multipart.MultipartFile;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class ProductRequest {

    private String name;
    private float price;
    private String category;
    private Float rating;
    private MultipartFile image;
    private String description;
}
