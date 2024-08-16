import joi from "joi";
import { generalFields } from "../../utilities/generalFields.js";



export const createProductValidation = {
    body : joi.object({
        title : joi.string().min(3).max(30).required(),
        stock : joi.number().min(1).integer().required(), 
        discount : joi.number().min(1).max(100) ,
        price : joi.number().min(1).integer().required(),
        brand : joi.string().min(24).max(24).required(),
        description : joi.string(),
    }),
    files : joi.object({

        image : joi.array().items(generalFields.file.required()).required(),
        coverImages : joi.array().items(generalFields.file.required()).required(),

    })  ,
    headers : generalFields.headers.required() ,
}


export const updateProductValidation = {
    body : joi.object({
        title : joi.string().min(3).max(30),
        stock : joi.number().min(1).integer(), 
        discount : joi.number().min(1).max(100) ,
        price : joi.number().min(1).integer(),
        brand : joi.string().min(24).max(24),
        description : joi.string(),
    }),
    files : joi.object({

        image : joi.array().items(generalFields.file),
        coverImages : joi.array().items(generalFields.file),

    })  ,
    headers : generalFields.headers.required() ,
}

export const deleteProductValidation = {

    body : joi.object({
        title : joi.string().min(3).max(30),
        stock : joi.number().min(1).integer(), 
        discount : joi.number().min(1).max(100) ,
        price : joi.number().min(1).integer(),
        brand : joi.string().min(24).max(24),
        description : joi.string(),
    }),
    files : joi.object({

        image : joi.array().items(generalFields.file),
        coverImages : joi.array().items(generalFields.file),

    })  ,
    headers : generalFields.headers.required() ,
      
}


export const getAllProductsValidation = {
  
    headers : generalFields.headers.required() ,
}


export const getSpecificProductValidation = {
  
    headers : generalFields.headers.required() ,
}