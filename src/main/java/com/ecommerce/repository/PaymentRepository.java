package com.ecommerce.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.ecommerce.model.Payment;

@Repository
public interface PaymentRepository extends JpaRepository<Payment,String> {

    @Query("SELECT p FROM Payment p WHERE p.receiptId = :receiptId")
    Payment findPaymentByReceiptId(@Param("receiptId") String receiptId);
} 
