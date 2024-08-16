import joi  from "joi" ;
import { generalFields } from "../../utilities/generalFields.js";


export const createWishlistValidation = {
    params : joi.object({
        productId : joi.string().min(24).max(24).required()
    }).required() ,
    headers : generalFields.headers.required() 
}

export const getFromWishListValidation = {
    params : joi.object({
        productId : joi.string().min(24).max(24).required()
    }).required() ,
    headers : generalFields.headers.required() 
}


export const deleteFromWishListValidation = {
    params : joi.object({
        productId : joi.string().min(24).max(24).required()
    }).required() ,
    headers : generalFields.headers.required() 
}