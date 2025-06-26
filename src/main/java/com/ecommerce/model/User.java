package com.ecommerce.model;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.Enumerated;
import jakarta.persistence.EnumType;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
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
@Entity
public class User implements UserDetails{
    
    @Id
    private String id;
    @Column(nullable = false)
    private String name;
    @Column(unique = true, nullable = false)
    private String email;
    @Column(nullable = false)
    private String password;
    @Column(length = 1000)
    private String profilePic;
    private String phoneNo;

    @Builder.Default
    private boolean enabled=true;
    @Builder.Default
    private boolean emailVarified=false; 
    @Builder.Default
    private boolean phoneVarified=false;

    @Enumerated(value = EnumType.STRING)
    @Builder.Default
    private Providers provider = Providers.SELF;
    private String providerId;

    @ElementCollection(fetch = FetchType.EAGER)
    @Builder.Default
    private List<String> roleList = new ArrayList<>();

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL,fetch = FetchType.LAZY)
    private List<Orders> orders;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL,fetch = FetchType.LAZY)
    private List<CartItem> cartItems;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL,fetch = FetchType.LAZY)
    private List<Shipping> shipping;


    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        
        Collection<SimpleGrantedAuthority> roles = roleList.stream().map(role-> new SimpleGrantedAuthority(role)).collect(Collectors.toList());

        return roles;
    }

    @Override
    public String getUsername() {
       return this.email;
    }

    @Override
    public boolean isEnabled() {
		return this.enabled;
	}
    
}


