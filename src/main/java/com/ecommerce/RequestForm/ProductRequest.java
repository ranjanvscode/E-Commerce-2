package com.ecommerce.RequestForm;

import java.math.BigDecimal;

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
    private BigDecimal price;
    private BigDecimal discount;
    private MultipartFile image;
    private String inStock;
    private String category;
    private Float rating;
    private String description;
}
