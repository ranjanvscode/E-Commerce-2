package com.ecommerce.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.ecommerce.model.Orders;
import com.ecommerce.model.User;

@Repository
public interface OrderRepository extends JpaRepository<Orders,String>{

    @Query("SELECT o FROM Orders o WHERE o.user = :user")
    List<Orders> findByUser(@Param("user") User user);

} 
