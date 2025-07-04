package com.ecommerce.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import com.ecommerce.RequestForm.UserRequest;
import com.ecommerce.service.ProductService;


@Controller
public class RootController {

    @Autowired
    ProductService productService;

    @Value("${razorpay.api_key}")
    private String RAZORPAY_KEY_ID;

    @GetMapping("/")
    public String general() {
        return "redirect:/home";
    }

    @GetMapping("/home")
    public String home(Model m) {
        UserRequest userFrom = new UserRequest();
        m.addAttribute("userForm", userFrom);
        m.addAttribute("RAZORPAY_KEY_ID", RAZORPAY_KEY_ID);
        return "home";
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/admin/orders")
    public String adminpage() {
        return "admin/orders";
    }

    @GetMapping("/user/order")
    public String order() {
        return "user/order";
    }

    @GetMapping("/invoice")
    public String test() {
        return "admin/invoice";
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/adminpannel")
    public String adminpannel(Model model) {
        model.addAttribute("admin", true);
        return "admin/adminpannel";
    }

    @GetMapping("/access-denied")
    public String accessDenied(){

      return "error/access-denied";
    }

    @GetMapping("/forgot-password")
    public String password(){

      return "forgot-password";
    }

    @GetMapping("/help")
    public String helpSupport(){

      return "help-support";
    }

    @GetMapping("/about")
    public String aboutUs(){

      return "aboutus";
    }

    @GetMapping("/user/profile")
    public String profile(){

      return "user/profile";
    }
}
