package com.ecommerce.controller;

import java.io.File;
import java.io.IOException;
import java.math.BigDecimal;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.ecommerce.RequestForm.ProductRequest;
import com.ecommerce.ResponseForm.ProductResponse;
import com.ecommerce.model.Category;
import com.ecommerce.model.Product;
import com.ecommerce.service.CategoryService;
import com.ecommerce.service.DiscountService;
import com.ecommerce.service.ProductService;


@RestController
@RequestMapping("/products")
public class ProductApiController {

    @Autowired
    private ProductService productService;

    @Autowired
    DiscountService discountService;

    @Autowired
    CategoryService categoryService;

    @GetMapping("/getAllProduct")
    public List<ProductResponse> getAllProducts() {

        List<Product> products = productService.getAllProduct();
        List<ProductResponse> productResponse = products.stream().map(p -> {
            BigDecimal finalPrice = discountService.getFinalPrice(p);

            // p.setDiscount(BigDecimal.ZERO);
            p.setDiscount(((p.getPrice().subtract(finalPrice)).multiply(BigDecimal.valueOf(100))).divide(p.getPrice()));

            return new ProductResponse(p.getId(),p.getName(), p.getPrice(), finalPrice,p.getDiscount(), p.getImageId(), p.isInStock(), p.getCategory().getCategoryName() , p.getRating(), p.getDescription());
            }).toList();
        
        return productResponse;
                
        // return productService.getAllProduct();
    }

 
    @PostMapping("/save")
    public String postMethodName(@ModelAttribute ProductRequest product, BindingResult result) {

        if (result.hasErrors()) {
            
            return "redirect:/adminpannel";
        }

        Category category = new Category();
        Category existingCategory = categoryService.getByName(product.getCategory()).orElse(null);
        
        Product product2 = new Product();

        if (existingCategory!=null) {
            product2.setCategory(existingCategory);
        }else{

            category.setCategoryName(product.getCategory());
            product2.setCategory(categoryService.saveCategory(category));
        }


        product2.setId(UUID.randomUUID().toString());
        product2.setName(product.getName());
        product2.setPrice(product.getPrice());
        product2.setDiscount(product.getDiscount());
        product2.setInStock(product.getInStock().equals("yes") ? true : false);
        product2.setDescription(product.getDescription());
        product2.setRating(product.getRating()!=null?product.getRating():0);    

        //Saving images in local folder
        MultipartFile file=product.getImage();
        if (file!=null && !file.isEmpty()) { // If file is empty then it will handle
             try {
                // Get original filename
                String originalFilename = file.getOriginalFilename();
                String fileName = System.currentTimeMillis() + "_" + originalFilename;

                // Save to real folder outside classpath
                String uploadDir = new File("uploads/images").getAbsolutePath();
                File dir = new File(uploadDir);
                if (!dir.exists()) dir.mkdirs();

                Path path = Paths.get(uploadDir + File.separator + fileName);
                Files.copy(file.getInputStream(), path, StandardCopyOption.REPLACE_EXISTING);

                String imageId = "/uploads/images/" + fileName;

                product2.setImageId(imageId);

                } catch (IOException e) {
                    e.printStackTrace();
            }
        }else{
            product2.setImageId(null);
        }
       
        productService.SaveProduct(product2);
        
        return "redirect:/adminpannel"; 
    }

    @DeleteMapping("/delete/{productId}")
    public void deleteProduct(@PathVariable("productId") String productId){
        productService.deleteProduct(productId);
    }

    @PostMapping("/updateProduct/{productId}")
    public void updateProduct(@ModelAttribute ProductRequest newProduct, @PathVariable("productId") String productId) {
        
        Product oldProduct = productService.getById(productId);

        //Set category in product
        if (newProduct.getCategory() != null && !newProduct.getCategory().equals(oldProduct.getCategory().getCategoryName())) {
            
                Category existingCategory = categoryService.getByName(newProduct.getCategory()).orElse(null);

                if (existingCategory!=null) {
                    oldProduct.setCategory(existingCategory);
                }else{

                    Category category = new Category();
                    category.setCategoryName(newProduct.getCategory());
                    oldProduct.setCategory(categoryService.saveCategory(category));
                }
        }


        //Delete old image and save new image
        MultipartFile newImageFile = newProduct.getImage();
        if (newImageFile!=null && !newImageFile.isEmpty()) {
            try {
                // 1. Delete old image from disk
                String oldImagePath = oldProduct.getImageId(); // e.g. "/uploads/images/abc.jpg"
                if (oldImagePath != null) {
                    // Convert to physical path
                    File oldFile = new File("uploads/images", new File(oldImagePath).getName());
                    if (oldFile.exists()) {
                        oldFile.delete(); // delete old file
                    }
                }

                // 2. Save new image
                String originalFilename = newImageFile.getOriginalFilename();
                String newFileName = System.currentTimeMillis() + "_" + originalFilename;
                String uploadDir = new File("uploads/images").getAbsolutePath();
                File dir = new File(uploadDir);
                if (!dir.exists()) dir.mkdirs();

                Path path = Paths.get(uploadDir + File.separator + newFileName);
                Files.copy(newImageFile.getInputStream(), path, StandardCopyOption.REPLACE_EXISTING);

                // 3. Set new image path in product
                oldProduct.setImageId("/uploads/images/" + newFileName);

            } catch (IOException e) {
                e.printStackTrace();
            }
        }

        oldProduct.setName(newProduct.getName());
        oldProduct.setPrice(newProduct.getPrice());
        oldProduct.setDiscount(newProduct.getDiscount());
        oldProduct.setInStock(newProduct.getInStock().equals("yes")?true:false);
        oldProduct.setRating(newProduct.getRating()!=null?newProduct.getRating():0);
        // oldProduct.setCategory(category);
        oldProduct.setDescription(newProduct.getDescription());

        productService.SaveProduct(oldProduct);
    }
    
}

