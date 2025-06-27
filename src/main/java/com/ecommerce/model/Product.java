package com.ecommerce.model;

import java.math.BigDecimal;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class Product {

    @Id
    private String id;
    @Column(nullable=false)
    private String name;
    @Column(nullable=false)
    private Float rating;
    private String imageId;
    private String description;
    private boolean inStock;
    
    private BigDecimal price;
    private BigDecimal discount; // Optional product-specific discount
    private BigDecimal discountPrize; // Optional product-specific discount

    @ManyToOne
    private Category category;

    // Get final price after discount
    public BigDecimal getFinalPrice(BigDecimal categoryDiscount, BigDecimal globalDiscount) {
            BigDecimal finalDiscount = discount.compareTo(BigDecimal.ZERO) > 0 ? discount
                                   : (categoryDiscount.compareTo(BigDecimal.ZERO) > 0
                                   ? categoryDiscount: (globalDiscount.compareTo(BigDecimal.ZERO) > 0 
                                   ? globalDiscount : BigDecimal.ZERO));

            System.out.println("Final Discount : "+finalDiscount);

        return price.subtract(price.multiply(finalDiscount.divide(BigDecimal.valueOf(100))));
    }
}
