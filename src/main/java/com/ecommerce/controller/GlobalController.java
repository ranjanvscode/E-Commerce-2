package com.ecommerce.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ModelAttribute;

import com.ecommerce.model.User;
import com.ecommerce.service.UserServiceImpl;

@ControllerAdvice
public class GlobalController {

    @Autowired
    UserServiceImpl userRepo;

    @ModelAttribute
    public void loggedInUserInfo(Model model,Authentication authentication){

        if (authentication==null) {
            return;
        }else{
            // String email = GetEmail.getEmailOfLoggedInUser(authentication);
            String email = authentication.getName();
            User user = userRepo.getUserByEmail(email);
            model.addAttribute("user", user);
        }
    }
}
