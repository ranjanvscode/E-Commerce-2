package com.ecommerce.Helper;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController; 

// Generate order id
@RestController
@RequestMapping("/payment")
public class UtilityMethos {

    @GetMapping("/generateReceipt")
    public ResponseEntity<Map<String, String>> generateReceiptId() {
        String receiptId = "ORD-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();

        Map<String, String> response = new HashMap<>();
        response.put("receiptId", receiptId);

        return ResponseEntity.ok(response);
    }

    
}
