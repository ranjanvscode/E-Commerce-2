package com.ecommerce.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ecommerce.Forms.OrderItemRequest;
import com.ecommerce.Forms.OrderRequest;
import com.ecommerce.ServiceInterface.UserService;
import com.ecommerce.model.Orders;
import com.ecommerce.model.Payment;
import com.ecommerce.model.OrderItem;
import com.ecommerce.model.Product;
import com.ecommerce.model.Shipping;
import com.ecommerce.model.User;
import com.ecommerce.service.OrderService;
import com.ecommerce.service.PaymentService;
import com.ecommerce.service.ProductService;

import jakarta.validation.Valid;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.validation.BindingResult;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;


@RestController
@RequestMapping("/user")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @Autowired
    private ProductService productService;

    @Autowired
    private UserService userService;

    @Autowired
    PaymentService paymentService;

    @PostMapping("/placeOrder")
    public ResponseEntity<String> placeOrder(@Valid @RequestBody OrderRequest request, Authentication authentication, BindingResult result) {
        
        if (result.hasErrors()) {
            
            return ResponseEntity.badRequest().body("Error in form field, Please correct them.");
        }

        // 1. Fetch User 
        String email = authentication.getName();
        User user = userService.getUserByEmail(email);

        Payment payment = paymentService.getPaymentByReceiptId(request.getReceiptId()); 

        // 2. Create Address
        // Address address = new Address();
        Shipping shipping = new Shipping();
        shipping.setName(request.getShipping().getName());
        shipping.setPhone(request.getShipping().getPhoneNo());
        shipping.setAddress(request.getShipping().getAddress());
        shipping.setCity(request.getShipping().getCity());
        shipping.setState(request.getShipping().getState());
        shipping.setPostalCode(request.getShipping().getZipCode());
        shipping.setUser(user);
        shipping.setId(UUID.randomUUID().toString());
        shipping.setShippedDate(null);
        shipping.setShippingCarrier(null);
        shipping.setShippingCost(49);
        shipping.setTrackingNumber(null);
        shipping.setShippingStatus(null);
        shipping.setTax(0);


        // 3. Create Order
        Orders orders = new Orders();
        orders.setOrderId(request.getReceiptId());
        orders.setUser(user);
        orders.setOrderDate(LocalDateTime.now());
        orders.setPaymentMethod(request.getPaymentMethod());
        orders.setPaymentStatus(null);
        orders.setShipping(shipping); 
        orders.setPayment(payment);

        float subTotal = 0;
        int itemCount = 0;

        List<OrderItem> orderItems = new ArrayList<>();
        for (OrderItemRequest itemReq : request.getItems()) {
            Product product = productService.getById(itemReq.getProductId());

            OrderItem item = new OrderItem();
            item.setId(UUID.randomUUID().toString());
            item.setProduct(product);
            item.setQuantity(itemReq.getQuantity());
            item.setPrice(product.getPrice());
            item.setOrders(orders); // set parent orders

            subTotal += item.getPrice();
            itemCount += item.getQuantity();

            orderItems.add(item);
        }

        orders.setOrderItems(orderItems);
        orders.setSubTotal(subTotal);
        orders.setTotalAmount(subTotal + shipping.getShippingCost() + shipping.getTax());
        orders.setItemCount(itemCount);

        // Save orders (cascades to Address and OrderItems)
        orderService.saveOrder(orders);

        return ResponseEntity.ok("Order placed successfully");
    }

    @GetMapping("/getAllOrder")
    public List<Orders> getAllOrder(Authentication authentication){

        String email = authentication.getName();
        User user = userService.getUserByEmail(email);

        return orderService.getAllOrders(user);
    }

    @GetMapping("/getAllUserOrders")
    public List<Orders> getAllUserOrder(){

        return orderService.getAllUserOrders();
    }
}
