package com.ecommerce.controller;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.ecommerce.RequestForm.ProfileRequest;
import com.ecommerce.RequestForm.UserRequest;
import com.ecommerce.ResponseForm.UserResponse;
import com.ecommerce.ServiceInterface.ImageService;
import com.ecommerce.model.User;
import com.ecommerce.service.UserServiceImpl;

import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.GetMapping;

@RestController
@RequestMapping("/account")
public class UserController {

    @Autowired
    UserServiceImpl userService;

    @Autowired
    ImageService imageService;

    @PostMapping("/register")
    public ResponseEntity<Map<String, String>> doRegister(@Valid @RequestBody UserRequest userForm, BindingResult errorResult) {
        Map<String, String> response = new HashMap<>();

        if (errorResult.hasErrors()) {
            response.put("status", "error");
            response.put("message", "Please fill all required fields correctly.");
            return ResponseEntity.badRequest().body(response);
        }

        User user = new User();
        user.setName(userForm.getName());
        user.setEmail(userForm.getEmail());
        user.setPassword(userForm.getPassword());
        user.setPhoneNo(" ");
        user.setProfilePic(" ");

        User data = userService.saveUser(user);

        if (data == null) {
            response.put("status", "error");
            response.put("message", "User already exists. Please login.");
            return ResponseEntity.status(409).body(response);
        } else {
            response.put("status", "success");
            response.put("message", "Registration successful! Please login.");
            return ResponseEntity.ok(response);
        }
    }

    @GetMapping("/profile")
    public ResponseEntity<UserResponse> getUserInfo(Authentication authentication) {

        String email = authentication.getName();
        User user = userService.getUserByEmail(email);
        UserResponse userResponse = new UserResponse();

        userResponse.setName(user.getName());
        userResponse.setEmail(user.getEmail());
        userResponse.setPhone(user.getPhoneNo());
        userResponse.setImage(user.getProfilePic());
        userResponse.setEmailVarified(user.isEmailVarified());
        userResponse.setPhoneVarified(user.isPhoneVarified());
        userResponse.setEnabled(user.isEnabled());
        userResponse.setShipping(user.getShipping());

        return ResponseEntity.ok(userResponse);
    }


        @PutMapping("/updateProfile")
        public ResponseEntity<?> updateUserProfile(
                Authentication authentication,
                @ModelAttribute ProfileRequest profileRequest) {

            String email = authentication.getName();
            User user = userService.getUserByEmail(email);

            // Update user fields
            user.setName(profileRequest.getName());
            user.setPhoneNo(profileRequest.getPhone());
            user.setEmail(profileRequest.getEmail());

            // Handle image upload if present
            MultipartFile imageFile = profileRequest.getImage();
            if (imageFile != null && !imageFile.isEmpty()) {
                try {
                    String publicId = user.getCloudinaryImageId();
                    if(publicId!=null) imageService.deleteImage(publicId);//Delete old profile pic
                    
                    String fileName = UUID.randomUUID().toString();// Cloudinary image Public Id
                    String fileUrl = imageService.uploadimage(imageFile,fileName);
                    user.setProfilePic(fileUrl);
                    user.setCloudinaryImageId(fileName);
                } catch (Exception e) {
                    return ResponseEntity.badRequest().build();
                }
            }

            userService.updateUser(user);

            return ResponseEntity.ok("Profile Updated.");
        }
    
}
