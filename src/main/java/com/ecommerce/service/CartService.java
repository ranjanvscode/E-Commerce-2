package com.ecommerce.service;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ecommerce.model.CartItem;
import com.ecommerce.model.Product;
import com.ecommerce.model.User;
import com.ecommerce.repository.CartRepository;

@Service
public class CartService {

    @Autowired
    private CartRepository cartRepository;

    public CartItem savItem(CartItem item){

        return cartRepository.save(item);
    }

    public List<CartItem> getAllCartItems(){

        return cartRepository.findAll();
    }

    public List<CartItem> getAllCartItemsByUser(User user){

        return cartRepository.findByUser(user);
    }

    public void updateQuantity(User user, Product product,int quantity){

        cartRepository.updateCartItemQuantity(user,product,quantity);
    }

    public void removeCartItem(User user, Product product){

        cartRepository.deleteCartItem(user,product);
    }

    public void removeAllCartItem(User user){

        cartRepository.deleteAllCartItem(user);
    }

    // public BigDecimal getTotalCartPrice(User user){

        // return cartRepository.getTotalCartAmountByUserId(user);
    // }

}
