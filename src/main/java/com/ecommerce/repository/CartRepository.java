package com.ecommerce.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.ecommerce.model.CartItem;
import com.ecommerce.model.Product;
import com.ecommerce.model.User;

import jakarta.transaction.Transactional;

@Repository
public interface CartRepository extends JpaRepository<CartItem,String> {

    List<CartItem> findByUser(User user);

    @Modifying
    @Transactional
    @Query("UPDATE CartItem c SET c.quantity = :quantity WHERE c.user = :user AND c.product = :product")
    void updateCartItemQuantity(@Param("user") User user,
                                @Param("product") Product product,
                                @Param("quantity") int quantity);


    @Modifying
    @Transactional
    @Query("DELETE FROM CartItem c WHERE c.user = :user AND c.product = :product")
    void deleteCartItem(@Param("user") User user,
                        @Param("product") Product product);

    
    @Modifying
    @Transactional
    @Query("DELETE FROM CartItem c WHERE c.user = :user")
    void deleteAllCartItem(@Param("user") User user);

    @Query("SELECT SUM(ci.quantity * p.price) " +
           "FROM CartItem ci " +
           "JOIN ci.product p " +
           "WHERE ci.user = :user")
    Float getTotalCartAmountByUserId(@Param("user") User user);
} 
