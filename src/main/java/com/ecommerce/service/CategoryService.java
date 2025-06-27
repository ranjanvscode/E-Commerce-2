package com.ecommerce.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ecommerce.model.Category;
import com.ecommerce.repository.CategoryRepository;

@Service
public class CategoryService {

    @Autowired
    CategoryRepository categoryRepository;

    public Category saveCategory(Category category){

        return categoryRepository.save(category);
    }

    public Optional<Category> getById(Long id){

        return categoryRepository.findById(id);
    }

    public Optional<Category> getByName(String name){

        return categoryRepository.findByNameCustom(name);
    }
}
