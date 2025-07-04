package com.ecommerce.ServiceInterface;

import org.springframework.web.multipart.MultipartFile;

public interface ImageService {

    String uploadimage(MultipartFile contactImg, String fileName);
    
    String getUrlFromPublicId(String fileName);

    String deleteImage(String publicId);

}
