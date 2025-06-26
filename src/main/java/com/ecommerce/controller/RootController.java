package com.ecommerce.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import com.ecommerce.Forms.UserRequest;
import com.ecommerce.service.ProductService;

@Controller
public class RootController {

    @Autowired
    ProductService productService;

    @GetMapping("/")
    public String general() {
        return "redirect:/home";
    }

    @GetMapping("/home")
    public String home(Model m) {
        UserRequest userFrom = new UserRequest();
        m.addAttribute("userForm", userFrom);
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

    @GetMapping("/sidebar")
    public String sidebar() {
        return "sidebar";
    }

    @GetMapping("/access-denied")
    public String accessDenied(){

      return "error/access-denied";
    }
    
}
