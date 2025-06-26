package com.ecommerce.Forms;

import jakarta.validation.constraints.*;
import lombok.Data;

import java.util.List;

@Data
public class OrderRequest {

    @NotBlank(message = "Payment method is required")
    private String paymentMethod;

    @NotNull(message = "Address is required")
    private ShippingRequest shipping;

    @NotEmpty(message = "At least one item is required")
    private List<OrderItemRequest> items;

    private String receiptId; 
} 

