package com.ecommerce.ResponseForm;

import java.util.List;

import com.ecommerce.model.Shipping;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class UserResponse {

    private String name;
    private String email;
    private String phone;
    private String image;
    private boolean enabled;
    private boolean emailVarified;
    private boolean phoneVarified;
    private List<Shipping> shipping;
}
