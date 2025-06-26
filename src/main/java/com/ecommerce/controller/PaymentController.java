package com.ecommerce.controller;

import com.ecommerce.ServiceInterface.UserService;
import com.ecommerce.model.Payment;
import com.ecommerce.model.User;
import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import com.razorpay.Utils;
import com.ecommerce.service.CartService;
import com.ecommerce.service.PaymentService;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/payment")
public class PaymentController {

    @Value("${razorpay.api_key}")
    private String RAZORPAY_KEY_ID;

    @Value("${razorpay.api_secret}")
    private String RAZORPAY_KEY_SECRET;

    @Autowired
    PaymentService paymentService;

    @Autowired
    UserService userService;

    @Autowired
    CartService cartService;


    @PostMapping("/createOrder")
    public Map<String, Object> createOrder(@RequestParam("amount") int amount, @RequestParam("receipt") String receipt, Authentication authentication) {

        Map<String, Object> response = new HashMap<>();

        String userEmail = authentication.getName();
        User user = userService.getUserByEmail(userEmail);

        Float totalAmountFromDBCart = cartService.getTotalCartPrice(user);
        int totalAmountFromUICart = amount;

        if (totalAmountFromDBCart.intValue() != totalAmountFromUICart) {
            System.out.println("DB Amount: "+totalAmountFromDBCart);
            System.out.println("UI Amount: "+totalAmountFromUICart);

            response.put("error", "Amount is not equal");
        }else{

        try {
            RazorpayClient razorpay = new RazorpayClient(RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET);

            JSONObject orderRequest = new JSONObject();
            orderRequest.put("amount", amount * 100); // convert ₹ to paise
            orderRequest.put("currency", "INR");
            orderRequest.put("receipt", receipt);

            Order order = razorpay.Orders.create(orderRequest);
            
            // Return only required fields
            response.put("id", order.get("id"));
            response.put("amount", order.get("amount"));
            response.put("currency", order.get("currency"));
            response.put("status", order.get("status"));

            //Save Payment in DB
            Payment payment = new Payment();

            payment.setRazorpayOrderId(order.get("id"));
            payment.setAmount(order.get("amount"));
            payment.setCurrency(order.get("currency"));
            // payment.setCreatedAt(order.get("created_at"));

            payment.setCreatedAt(((Date) order.get("created_at")).toInstant().atZone(ZoneId.systemDefault()).toLocalDateTime());


            payment.setReceiptId(receipt);
            payment.setUser(user);
            payment.setStatus(order.get("status"));
            payment.setRazorpayPaymentId(null);
            payment.setRazorpaySignature(null);
            payment.setFailureReason(null);
            payment.setPaymentTime(null);

            paymentService.savePayment(payment);

        } catch (RazorpayException e) {
            System.out.println("Problem in Razorpay exception");
            response.put("error", e.getMessage());
        }
    }

        System.out.println(response);
        return response;
    }

    //Payment Signature verification JAVA Code

    @PostMapping("/verifySignature")
    public ResponseEntity<String> verifyPayment(@RequestBody Map<String, String> data) {
        String orderId = data.get("razorpay_order_id");
        String paymentId = data.get("razorpay_payment_id");
        String signature = data.get("razorpay_signature");
        String secret = RAZORPAY_KEY_SECRET;

        try {
                JSONObject options = new JSONObject();
                options.put("razorpay_order_id", orderId);
                options.put("razorpay_payment_id", paymentId);
                options.put("razorpay_signature", signature);

                // Verify the signature
                boolean status = Utils.verifyPaymentSignature(options, secret);

                if (status) {

                    Payment payment = paymentService.getPaymentByRazorpayId(orderId);

                    payment.setStatus("paid");
                    payment.setRazorpayPaymentId(paymentId);
                    payment.setRazorpaySignature(signature);
                    payment.setPaymentTime(LocalDateTime.now());
                    // payment.setOrders(null);

                    paymentService.savePayment(payment);

                    return ResponseEntity.ok("Payment Verified");
                } else {
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid Signature");
                }
        } catch (Exception e) {

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error verifying payment");
        }
    }


    @PostMapping("/failure")
    public ResponseEntity<String> saveFailedPayment(@RequestBody Map<String, String> failureData) {

        // Payment payment = new Payment();
        Payment payment = paymentService.getPaymentByRazorpayId(failureData.get("razorpay_order_id"));
        payment.setRazorpayPaymentId(failureData.get("razorpay_payment_id"));
        payment.setStatus("failed");
        payment.setAmount(0);
        payment.setFailureReason(failureData.get("reason") + " - " + failureData.get("description"));

        paymentService.savePayment(payment);

        return ResponseEntity.ok("Failure logged");
    }

}

