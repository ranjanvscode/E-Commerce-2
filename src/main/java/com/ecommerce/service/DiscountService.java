package com.ecommerce.service;

import java.math.BigDecimal;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ecommerce.model.Category;
import com.ecommerce.model.DiscountConfig;
import com.ecommerce.model.Product;
import com.ecommerce.repository.DiscountConfigRepository;

@Service
public class DiscountService {

    @Autowired
    private DiscountConfigRepository discountConfigRepo;

    public BigDecimal getGlobalDiscount() {
        return discountConfigRepo.findById("discount7858")
                .map(DiscountConfig::getGlobalDiscount)
                .orElse(BigDecimal.ZERO);
    }

    public BigDecimal getCategoryDiscount(Category category) {
        return category != null && category.getCategoryDiscount().compareTo(BigDecimal.ZERO) > 0
                ? category.getCategoryDiscount()
                : BigDecimal.ZERO;
    }

    public BigDecimal getFinalPrice(Product product) {
        BigDecimal global = getGlobalDiscount();
        BigDecimal category = getCategoryDiscount(product.getCategory());
        System.out.println("Cate:"+category+"---- Globla:"+global);
        return product.getFinalPrice(category, global);
    }
}

