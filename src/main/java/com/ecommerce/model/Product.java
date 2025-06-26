package com.ecommerce.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
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
    private float price;
    private String category;
    private Float rating;
    private String imageId;
    private String description;
}
