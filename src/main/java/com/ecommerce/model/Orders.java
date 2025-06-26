package com.ecommerce.model;

import java.time.LocalDateTime;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "orders")
public class Orders {
    
    @Id
    @Column(name = "order_id")
    private String orderId;

    @ManyToOne
    @JsonIgnore
    private User user;

    @OneToOne(cascade = CascadeType.ALL,fetch = FetchType.EAGER)
    private Shipping shipping;

    @OneToMany(mappedBy = "orders", cascade = CascadeType.ALL,fetch = FetchType.EAGER)
    private List<OrderItem> orderItems;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(nullable=true)
    private Payment payment;

    private LocalDateTime orderDate;
    private float totalAmount;
    private int itemCount;
    private String paymentMethod;
    private String paymentStatus;
    private float subTotal;
}


