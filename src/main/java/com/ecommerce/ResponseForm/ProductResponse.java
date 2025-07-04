package com.ecommerce.ResponseForm;

import java.math.BigDecimal;

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
public class ProductResponse {

    private String id;
    private String name;
    private BigDecimal price;
    private BigDecimal discountPrice;
    private BigDecimal discount;
    private String image;
    private String cImageId;
    private boolean inStock;
    private String category;
    private Float rating;
    private String description;
}
