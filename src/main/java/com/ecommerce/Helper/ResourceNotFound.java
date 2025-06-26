package com.ecommerce.Helper;

public class ResourceNotFound extends RuntimeException {

    public ResourceNotFound (String message)
    {
        super(message);
    }

    public ResourceNotFound ()
    {
        super("User not found");
    }

}
