package com.ecommerce.model;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@AllArgsConstructor 
@NoArgsConstructor
@Entity
public class OrderItem {

    @Id
    private String id;

    @ManyToOne
    @JoinColumn(name = "order_id")
    @JsonIgnore
    private Orders orders;

    @ManyToOne
    private Product product;

    private int quantity;
    private float price;

}
