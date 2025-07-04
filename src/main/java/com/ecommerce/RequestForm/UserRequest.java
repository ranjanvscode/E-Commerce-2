package com.ecommerce.RequestForm;

import org.springframework.web.multipart.MultipartFile;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString
public class UserRequest {

    @NotBlank(message = "Name is required")
    @Size(min=3,message = "Name should be min 3 character")
    private String name;

    @NotBlank(message = "Email required")
    @Email(message = "Email should be valid")
    private String email; 

    @NotBlank(message = "Password is required")
    private String password;

    // @NotBlank(message = "Contact No. is required")
    //@Pattern(regexp = "^[0-9]{10}$", message = "Invalid format") // For every type: ^\\+?[0-9]{1,3}?[-.\\s]?\\(?[0-9]{1,4}?\\)?[-.\\s]?[0-9]{1,4}[-.\\s]?[0-9]{1,9}$
    //private String phoneNo;

}
