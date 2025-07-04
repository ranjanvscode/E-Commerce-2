package com.ecommerce.service;

import java.io.IOException;
import java.io.InputStream;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.ecommerce.ServiceInterface.ImageService;

@Service
public class ImageServiceImpl implements ImageService {

    Cloudinary cloudinary;

    public ImageServiceImpl(Cloudinary cloudinary){
        this.cloudinary = cloudinary;
    } 

    @Override
    public String uploadimage(MultipartFile imageFile, String fileName){

        
        try{

            InputStream is = imageFile.getInputStream();
            byte[] data = new byte[is.available()];
            is.read(data);

            cloudinary.uploader().upload(data, ObjectUtils.asMap("public_id",fileName));

            return this.getUrlFromPublicId(fileName);

        }catch(IOException e){
            e.printStackTrace();
            return null;
        }
    }

    @Override
    public String deleteImage(String publicId){

        try {
            cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
            return "Deleted";
        } catch (Exception e) {
            e.printStackTrace();
            return "failed";
        }
    }


    @Override
    public  String getUrlFromPublicId(String fileName){

        return cloudinary.url().generate(fileName);
    }
}
