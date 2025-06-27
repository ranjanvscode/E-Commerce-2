package com.ecommerce.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ecommerce.model.DiscountConfig;

@Repository
public interface DiscountConfigRepository extends JpaRepository<DiscountConfig, String> {

}
