package com.ecommerce.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;

import com.ecommerce.Helper.Message;
import com.ecommerce.Helper.MessageType;
import com.ecommerce.RequestForm.UserRequest;
import com.ecommerce.model.User;
import com.ecommerce.service.UserServiceImpl;

import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;

@Controller
public class UserController {

    @Autowired
    UserServiceImpl userService = new UserServiceImpl();

    @PostMapping("/register")
    public String doRegister(@Valid @ModelAttribute UserRequest userForm, BindingResult errorResult,HttpSession session) {


        if (errorResult.hasErrors()) {

            return "redirect:/home";
        }

        User user = new User();
        user.setName(userForm.getName());
        user.setEmail(userForm.getEmail());
        user.setPassword(userForm.getPassword());
        user.setPhoneNo(" ");
        user.setProfilePic(" ");
        
        User data = userService.saveUser(user);

        Message msg=null;
        if (data==null) {
            
            msg = Message.builder().content("User already exist").type(MessageType.green).build();
        }else{

            msg = Message.builder().content("Registration Successful").type(MessageType.green).build();
        }

        session.setAttribute("message", msg);

        return "redirect:/home";
    }

}
