package com.ecommerce.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.ecommerce.model.OrderItem;
import com.ecommerce.model.Orders;

import java.math.BigDecimal;
import java.util.*;

@Service
public class EmailService {

    @Value("${brevo.api.key}")
    private String brevoApiKey;

    private static final String API_URL = "https://api.brevo.com/v3/smtp/email";

    public boolean sendEmail(String toEmail, String subject, String htmlContent) {
        RestTemplate restTemplate = new RestTemplate();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("api-key", brevoApiKey);

        Map<String, Object> payload = new HashMap<>();
        payload.put("sender", Map.of("name", "RMR", "email", "support@rmrdigitalmart.com"));    
        payload.put("to", List.of(Map.of("email", toEmail)));
        payload.put("subject", subject);
        payload.put("htmlContent", htmlContent);

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(payload, headers);

        try {
            ResponseEntity<String> response = restTemplate.postForEntity(API_URL, request, String.class);
            return response.getStatusCode().is2xxSuccessful();
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    public void sendRegistrationEmail(String email, String name) {
        String subject = "Welcome to RMR Digital Mart!";
        String html = "<h2>Hello, " + name + " 👋</h2><p>Thanks for registering with RMR. We're excited to have you!</p>";
        sendEmail(email, subject, html);
    }

    public void sendOrderConfirmation(String email, Orders order) {
        String subject = "Your Order " + order.getOrderId() + " Has Been Confirmed";
        String emailContent = createSimpleOrderEmail(order.getOrderId(), order.getShipping().getName(),order.getOrderItems(), order.getTotalAmount());
        sendEmail(email, subject, emailContent);
    }

    public static String createSimpleOrderEmail(String orderNumber, String customerName,
                                                List<OrderItem> items, BigDecimal total) {
        // Build product list
        StringBuilder productList = new StringBuilder();
        for (OrderItem item : items) {
            productList.append("<tr>")
                      .append("<td style='padding: 8px; border-bottom: 1px solid #eee;'>").append(item.getProduct().getName()).append("</td>")
                      .append("<td style='padding: 8px; border-bottom: 1px solid #eee; text-align: center;'>").append(item.getQuantity()).append("</td>")
                      .append("<td style='padding: 8px; border-bottom: 1px solid #eee; text-align: right;'>₹").append(String.format("%.2f", item.getPrice())).append("</td>")
                      .append("</tr>");
        }
        
        return "<html>" +
               "<body style='font-family: Arial, sans-serif; margin: 20px;'>" +
               "<div style='max-width: 600px; margin: 0 auto; border: 1px solid #ddd; padding: 20px;'>" +
               
               "<h1 style='color: #0d6efd; text-align: center;'>Order Confirmation</h1>" +

               "<div style='background-color: #f9f9f9; padding: 15px; margin: 20px 0;'>" +
               "<h2 style='color: #333; margin: 0;'>Thank you for your order!</h2>" +
               "<p>Dear " + customerName + ",</p>" +
               "<p>Your order has been confirmed and is being processed.Here are the details:</p>" +
               "</div>" +
               "<p><strong>Order Number:</strong> " + orderNumber + "</p>" +
               
               "<h3>Items Ordered:</h3>" +
               "<table style='width: 100%; border-collapse: collapse;'>" +
               "<tr style='background-color: #f5f5f5;'>" +
               "<th style='padding: 10px; text-align: left; border-bottom: 2px solid #ddd;'>Product</th>" +
               "<th style='padding: 10px; text-align: center; border-bottom: 2px solid #ddd;'>Quantity</th>" +
               "<th style='padding: 10px; text-align: right; border-bottom: 2px solid #ddd;'>Price</th>" +
               "</tr>" +
               productList.toString() +
               "</table>" +
               
               "<div style='text-align: right; margin: 20px 0; padding: 15px; background-color: #f9f9f9;'>" +
               "<h3 style='margin: 0;'>Total: ₹" + total + "</h3>" +
               "</div>" +
               
               "<p>We will send you a shipping confirmation once your order is processed.</p>" +
               
               "<p style='text-align: center; margin-top: 30px; color: #666;'>Thank you for shopping with us!</p>" +
               
               "</div>" +
               "</body>" +
               "</html>";
    }

}


