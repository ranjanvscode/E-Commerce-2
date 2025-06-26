package com.ecommerce.Forms;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class ShippingRequest {

    @NotBlank(message = "Name is required") 
    private String name; 

    @NotBlank(message = "Phone number is required")
    @Pattern(regexp = "\\d{10}", message = "Phone number must be 10 digits")
    private String phoneNo;

    @NotBlank(message = "Address is required")
    private String address;

    @NotBlank(message = "City is required")
    private String city;

    @NotBlank(message = "State is required")
    private String state;

    @NotBlank(message = "Zip code is required")
    @Pattern(regexp = "\\d{6}", message = "Zip code must be 6 digits")
    private String zipCode;
}

