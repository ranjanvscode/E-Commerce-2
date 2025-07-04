package com.ecommerce.Configration;


import java.nio.charset.StandardCharsets;
import java.net.URLEncoder;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;

import com.ecommerce.service.CustomUserDetailService;

@Configuration
@EnableMethodSecurity(prePostEnabled = true) 
public class SecurityConfigration {

    @Autowired
    CustomUserDetailService customUserDetailService;

    @Bean
    SecurityFilterChain securityFilterChain(HttpSecurity httpSecurity) throws Exception {

        String encodedError = URLEncoder.encode("You have been logged out.", StandardCharsets.UTF_8);
       
        httpSecurity.csrf(csrf -> csrf.disable())
        .authorizeHttpRequests(authorize -> {
            authorize
                .requestMatchers("/", "/home", "/account/register").permitAll()
                .requestMatchers("/admin/**").hasRole("ADMIN")
                .requestMatchers("/adminpannel/**", "/user/**", "/cart/**", "/account/**").authenticated()
                .anyRequest().permitAll();
        })
        .formLogin(form -> form
            .loginPage("/")
            .loginProcessingUrl("/authenticate")
            .defaultSuccessUrl("/", true)
            .usernameParameter("email")
            .passwordParameter("password")
            .failureHandler(customAuthenticationFailureHandler())
            .permitAll()
        )
        .rememberMe(rememberMe -> rememberMe
            .key("09228c3ac25554f39d767fe325ce3") // Change this to a secure, unique key!
            .rememberMeParameter("remember-me") // Name of checkbox in your login form
            .tokenValiditySeconds(7 * 24 * 60 * 60) // 7 days
            .userDetailsService(customUserDetailService)
        )
        .logout(logout -> logout
            .logoutUrl("/logout")
            .logoutSuccessUrl("/home?logout=" + encodedError)
        )
        .exceptionHandling(exception -> exception.accessDeniedHandler(accessDeniedHandler()));

        return httpSecurity.build();
    }

    @Bean
    public AccessDeniedHandler accessDeniedHandler() {

        return (request, response, accessDeniedException) -> response.sendRedirect("/access-denied");
    }

    @Bean
    AuthenticationProvider authenticationProvider()
    {
        DaoAuthenticationProvider daoAuthenticationProvider = new DaoAuthenticationProvider();

        daoAuthenticationProvider.setUserDetailsService(customUserDetailService);
        daoAuthenticationProvider.setPasswordEncoder(passwordEncoder());

        return daoAuthenticationProvider;
    }

    @Bean
    AuthenticationFailureHandler customAuthenticationFailureHandler() {
        return (request, response, exception) -> {

            String errorMessage = "Invalid username or password";

            if (exception instanceof BadCredentialsException) {
                errorMessage = "Incorrect username or password.";
            }else if (exception instanceof DisabledException) {
                errorMessage = "Your account has been disabled.";
            } 
            
            String encodedError = URLEncoder.encode(errorMessage, StandardCharsets.UTF_8);
            response.sendRedirect("/home?loginError=" + encodedError);

        };
    }

    @Bean
    PasswordEncoder passwordEncoder()
    {
        return new BCryptPasswordEncoder();
    }
}

