package com.ecommerce.model;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class Shipping {

    @Id
    private String id;

    @ManyToOne
    @JsonIgnore
    private User user;

    @NotBlank(message = "Name is required")
    @Size(min=2,message = "Name should be min 2 character")
    private String name;

    @NotBlank(message = "Contact No. is required")
    @Pattern(regexp = "^[0-9]{10}$", message = "Invalid format")
    private String phone;

    @NotBlank(message = "Address is required")
    private String address;

    @NotBlank
    private String city;
    @NotBlank
    private String state;
    @NotBlank
    private String postalCode;

    private LocalDateTime shippedDate; 
    private String shippingStatus; 
    private String trackingNumber;
    private String shippingCarrier; 
    private float shippingCost;
    private float tax;

}
